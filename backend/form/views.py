from django.http import HttpResponse
from django.shortcuts import render
from django.db.models import Count
from rest_framework import viewsets
from car.serializers import CarSerializer
from car.models import Car
from owner.models import Owner
from owner.serializers import OwnerSerializer
from .serializers import FormSerializer, CenterSerializer
from .models import Form, Center
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser 
from django.forms.models import model_to_dict
from datetime import datetime, timedelta
from django.db.models import Q
import calendar
import jwt

class FormView(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            registers = Form.objects.filter(center__id=payload['center']['id'])
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            registers = Form.objects.all()
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def check_car(self, request):
        car_request = request.data['car']
        if car_request['owner'] is None:
            return Response('Owner is None', status=400)
        try:
            owner = Owner.objects.get(id=car_request['owner']['id'])
        except:
            owner = None
        
        if owner is None:
            owner_serializer = OwnerSerializer(data=car_request['owner'])
            if owner_serializer.is_valid():
                owner = Owner(**car_request['owner'])
                owner_serializer.save()
            else:
                return owner_serializer.errors

        car_data = car_request.copy()
        car_data['owner'] = None
        
        car_serializer = CarSerializer(data=car_data)
        
        if car_serializer.is_valid():
            car_data['owner'] = owner
            car = Car(**car_data)
            car.save()
            return car
        else:
            return Response(car_serializer.errors, status=400)
    
    def post(self, request, format=None):
        if not request.data:
            return Response('Empty Body', status=400)
        
        if request.data.get("car") is None or request.data['car'] is None:
            return Response('Car is None', status=400)
        
        try:
            car = Car.objects.get(registration_number=request.data['car']['registration_number'])
        except:
            car = None
        
        if car is None:
            car = self.check_car(request)
            if not isinstance(car, Car):
                return Response(car, status=400)
            
        if request.data.get("center") is None or request.data['center'] is None:
            return Response('Center is None', status=400)
        
        try:
            center = Center.objects.get(id=request.data['center']['id'])
        except:
            center = None

        if center is None:
            center_serializer = CenterSerializer(center, data=request.data['center'])
            if center_serializer.is_valid():
                center = Center(**request.data['center'])
                center_serializer.save()
            else:
                return Response(center_serializer.errors, status=400)

        register_data = request.data.copy()
        register_data['car'] = None
        register_data['center'] = None

        register_serializer = FormSerializer(data=register_data)
        
        if register_serializer.is_valid():
            register_data['car'] = car
            
            register_data['center'] = center
            register = Form(**register_data)
            register.save()
            response = model_to_dict(register)
            response['car'] = model_to_dict(register.car)
            response['center'] = model_to_dict(register.center)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(register_serializer.errors, status=400)
    
class FormDetailView(FormView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, id, *args, **kwargs):
        try:
            register = Form.objects.get(register_id=id)
            serializer = FormSerializer(register)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
    
    def check_owner(self, request, car):
        if request.get("owner") is None or request['owner'] is None:
            return car.owner
        try:
            owner = Owner.objects.get(id=request['owner']['id'])
            owner_serializer = OwnerSerializer(owner, data=request['owner'])
            
        except:
            owner_serializer = OwnerSerializer(car.owner, data=request['owner'])

        if owner_serializer.is_valid():
            owner = Owner(**request['owner'])
            owner_serializer.save()
            return owner
        else:
            return owner_serializer.errors
    
    def check_car(self, request, register):
        if request.data.get("car") is None or request.data['car'] is None:
            return register.car
        
        car_request = request.data['car']
        try:
            car = Car.objects.get(registration_number=car_request['registration_number'])
            owner = self.check_owner(car_request, car)
            if not isinstance(owner, Owner):
                return Response(owner, status=400)
            
        except:
            car = register.car
            owner = self.check_owner(car_request, car)
            if not isinstance(owner, Owner):
                return Response(owner, status=400)
            
        car_data = car_request.copy()
        car_data['owner'] = None
            
        car_serializer = CarSerializer(car, data=car_data)
            
        if car_serializer.is_valid():
            car_data['owner'] = owner
            car = Car(**car_data)
            car.save()
            return car
        else:
            return Response(car_serializer.errors, status=400)
    
    def check_center(self, request, register):
        if request.data.get("center") is None or request.data['center'] is None:
            return register.center
        
        center_request = request.data['center']
        try:
            center = Center.objects.get(id=center_request['id'])
        except:
            center = register.center
            
        center_serializer = CenterSerializer(center, data=center_request)
            
        if center_serializer.is_valid():
            center = Center(**request.data['center'])
            center_serializer.save()
            return center
        else:
            return center_serializer.errors
    
    def put(self, request, id, *args, **kwargs):
        if not request.data:
            return Response('Empty Body', status=400)
        
        try:
            register = Form.objects.get(register_id=id)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)

        car = self.check_car(request, register)

        if not isinstance(car, Car):
            return Response(car, status=400)
        
        center = self.check_center(request, register)
        
        if not isinstance(center, Center):
            return Response(center, status=400)
        
        register_data = request.data.copy()
        register_data['car'] = None
        register_data['center'] = None
        
        register_serializer = FormSerializer(register, data=register_data)
        
        if register_serializer.is_valid():
            register_data['car'] = car
            register_data['center'] = center

            register = Form(**register_data)
            register.save()
            response = model_to_dict(register)
            response['car'] = model_to_dict(car)
            response['car']['owner'] = model_to_dict(car.owner)
            response['center'] = model_to_dict(register.center)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(register_serializer.errors, status=400)
    
    def delete(self, request, id, *args, **kwargs):
        try:
            form = Form.objects.get(register_id=id)
            form.delete()
            return Response('Form Deleted', status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
        
class FormMonthViewAll(APIView):
    def get(self, request, month, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__month=month, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__month=month)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormQuarterViewAll(APIView):
    def get(self, request, quarter, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        start = (quarter - 1) * 2 + quarter
        mid = start + 1
        end = start + 2

        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(Q(register_date__month=start) | Q(register_date__month=mid) | Q(register_date__month=end), center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(Q(register_date__month=start) | Q(register_date__month=mid) | Q(register_date__month=end))
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormYearViewAll(APIView):
    def get(self, request, year, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__year=year, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__year=year)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
class FormMonthInYearViewAll(APIView):
    def get(self, request, month, year, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__month=month, register_date__year=year, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__month=month, register_date__year=year)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

def CountInMonthByCenter(request, year):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(register_date__year=year, center__id=payload['center']['id'])
            month = total.values('register_date__month').annotate(count=Count('register_date__month'))
            return HttpResponse(month)
        # Cục
        else:
            total = Form.objects.filter(register_date__year=year)
            month = total.values('register_date__month', 'center_id').annotate(count=Count('center_id'))
            return HttpResponse(month)

class FormMonthViewDistrict(APIView):
    def get(self, request, month, district, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__month=month, center__district=district, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__month=month, center__district=district)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
class FormQuarterViewDistrict(APIView):
    def get(self, request, quarter, district, *args, **kwargs):
        start = (quarter - 1) * 2 + quarter
        mid = start + 1
        end = start + 2

        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(Q(register_date__month=start) | Q(register_date__month=mid) | Q(register_date__month=end), center__district=district, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(Q(register_date__month=start) | Q(register_date__month=mid) | Q(register_date__month=end), center__district=district)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormYearViewDistrict(APIView):
    def get(self, request, year, district, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__year=year, center__district=district, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__year=year, center__district=district)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormMonthInYearViewDistrict(APIView):
    def get(self, request, month, year, district, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            register = Form.objects.filter(register_date__month=month, register_date__year=year, center__district=district, center__id=payload['center']['id'])
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            register = Form.objects.filter(register_date__month=month, register_date__year=year, center__district=district)
            serializer = FormSerializer(register, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormExpiringView(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, *args, **kwargs):
        today = datetime.today()
        enddate = datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])

        token = request.headers.get('Token')
        if not token:
            return Response('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return Response('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            registers = Form.objects.filter(expired_date__lte=enddate, center__id=payload['center']['id'])
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        # Cục
        else:
            registers = Form.objects.filter(expired_date__lte=enddate)
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class FormExpiringCityView(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, city, *args, **kwargs):
        registers = Form.objects.filter(register_city=city)
        today = datetime.today()
        enddate = datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])
        registers = registers.filter(expired_date__lte=enddate)
        serializer = FormSerializer(registers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FormExpiringDistrictView(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, district, *args, **kwargs):
        registers = Form.objects.filter(register_district=district)
        today = datetime.today()
        enddate = datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1])
        registers = registers.filter(expired_date__lte=enddate)
        serializer = FormSerializer(registers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)