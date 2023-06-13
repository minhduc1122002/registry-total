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
from django.http import JsonResponse

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
    
    def get_car(self, request):
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
            else:
                return owner_serializer.errors

        car_data = car_request.copy()
        car_data['owner'] = None
        
        car_serializer = CarSerializer(data=car_data)
        if car_serializer.is_valid():
            car_data['owner'] = owner
            print(owner)
            car = Car(**car_data)
            return car
        else:
            return car_serializer.errors
    
    def post(self, request, format=None):
        if not request.data:
            return Response('Empty Body', status=400)
        
        if request.data.get("car") is None or request.data['car'] is None:
            return Response('Car is None', status=400)
        
        try:
            car = Car.objects.get(registration_id=request.data['car']['registration_id'])
        except:
            car = None
        
        if car is None:
            car = self.get_car(request)
            if not isinstance(car, Car):
                return Response(car, status=400)
        else:
            try:
                exsited_form = Form.objects.get(car__registration_id=car.registration_id)
            except:
                exsited_form = None

            if exsited_form is not None:
                return Response('Form with this car already exsited', status=400)
                
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
            else:
                return Response(center_serializer.errors, status=400)
            
        register_data = request.data.copy()
        register_data['car'] = None
        register_data['center'] = None

        register_serializer = FormSerializer(data=register_data)
        
        if register_serializer.is_valid():
            car.inspection_status = "Đã Đăng Kiểm"
            register_data['car'] = car
            register_data['center'] = center
            register = Form(**register_data)
            car.owner.save()
            car.save()
            center.save()
            register.save()
            response = model_to_dict(register)
            response['car'] = model_to_dict(register.car)
            response['car']['owner'] = model_to_dict(car.owner)
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
    
    def get_owner(self, request, car):
        if request.get("owner") is None or request['owner'] is None:
            return car.owner
        try:
            owner = Owner.objects.get(id=request['owner']['id'])
            owner_serializer = OwnerSerializer(owner, data=request['owner'])
            
        except:
            owner_serializer = OwnerSerializer(car.owner, data=request['owner'])

        if owner_serializer.is_valid():
            owner = Owner(**request['owner'])
            return owner
        else:
            return owner_serializer.errors
    
    def get_car(self, request, register):
        if request.data.get("car") is None or request.data['car'] is None:
            return register.car
        
        car_request = request.data['car']
        try:
            car = Car.objects.get(registration_id=car_request['registration_id'])
            owner = self.get_owner(car_request, car)
            if not isinstance(owner, Owner):
                return owner
            
        except:
            car = register.car
            owner = self.get_owner(car_request, car)
            if not isinstance(owner, Owner):
                return owner
            
        car_data = car_request.copy()
        car_data['owner'] = None
            
        car_serializer = CarSerializer(car, data=car_data)
        
        if car_serializer.is_valid():
            car_data['owner'] = owner
            car = Car(**car_data)
            return car
        else:
            return car_serializer.errors
    
    def get_center(self, request, register):
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

        car = self.get_car(request, register)

        if not isinstance(car, Car):
            return Response(car, status=400)
        
        center = self.get_center(request, register)
        
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
            car.owner.save()
            car.save()
            center.save()
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

def CountInMonthByCenter(request, year, center_id=None):
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
            month = list(total.values('register_date__month').annotate(count=Count('register_date__month')))
            return JsonResponse(month, safe=False)
        # Cục
        ## Từng trung tâm
        elif center_id is not None:
            total = Form.objects.filter(register_date__year=year, center__id=center_id)
            month = list(total.values('register_date__month').annotate(count=Count('register_date__month')))
            return JsonResponse(month, safe=False)
        ## Tất cả trung tâm
        else:
            total = Form.objects.filter(register_date__year=year)
            month = list(total.values('register_date__month', 'center_id').annotate(count=Count('center_id')))
            return JsonResponse(month, safe=False)

def CountInMonthAll(request, year):
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
            month = list(total.values('register_date__month').annotate(count=Count('register_date__month')))
            return JsonResponse(month, safe=False)
        # Cục
        else:
            total = Form.objects.filter(register_date__year=year)
            month = list(total.values('register_date__month').annotate(count=Count('register_date__month')))
            return JsonResponse(month, safe=False)

def CountInYearAll(request, center_id=None):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(center__id=payload['center']['id'])
            year = list(total.values('register_date__year').annotate(count=Count('register_date__year')))
            return JsonResponse(year, safe=False)
        # Cục
        ## Từng trung tâm
        elif center_id is not None:
            total = Form.objects.filter(center__id=center_id)
            year = list(total.values('register_date__year').annotate(count=Count('register_date__year')))
            return JsonResponse(year, safe=False)
        ## Tất cả trung tâm
        else:
            total = Form.objects.all()
            year = list(total.values('register_date__year').annotate(count=Count('register_date__year')))
            return JsonResponse(year, safe=False)

def CountAllByCenter(request, center_id=None):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(center__id=payload['center']['id']).count()
            return JsonResponse({'count': total})
        # Cục
        ## Từng trung tâm
        elif center_id is not None:
            total = Form.objects.filter(center__id=center_id).count()
            return JsonResponse({'count': total})
        ## Tất cả trung tâm
        else:
            total = Form.objects.all()
            count = list(total.values('center_id').annotate(count=Count('center_id')))
            return JsonResponse(count, safe=False)

def CountInYearByCity(request, year):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Cục
        if payload['role'] == 'department':
            total = Form.objects.filter(register_date__year=year)
            count = list(total.values('center__city').annotate(count=Count('center__city')))
            return JsonResponse(count, safe=False)
        else:
            return Response("You are unauthorized", status=status.HTTP_401_UNAUTHORIZED)

def CountInMonthByCity(request, year, month):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Cục
        if payload['role'] == 'department':
            total = Form.objects.filter(register_date__year=year, register_date__month=month)
            count = list(total.values('center__city').annotate(count=Count('center__city')))
            return JsonResponse(count, safe=False)
        else:
            return Response("You are unauthorized", status=status.HTTP_401_UNAUTHORIZED)
            
def ExpiredAllByCenter(request, center_id=None):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        today = datetime.today()
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(center__id=payload['center']['id'])
            expired_count = total.filter(expired_date__lt=today).count()
            return JsonResponse({'count': expired_count})
        # Cục
        ## Từng trung tâm
        elif center_id is not None:
            total = Form.objects.filter(center__id=center_id)
            expired_count = total.filter(expired_date__lt=today).count()
            return JsonResponse({'count': expired_count})
        ## Tất cả trung tâm
        else:
            total = Form.objects.filter(expired_date__lt=today)
            count = list(total.values('center_id').annotate(count=Count('center_id')))
            return JsonResponse(count, safe=False)

def Expired2MonthByCenter(request, center_id=None):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        today = datetime.today()
        enddate = datetime(today.year, today.month+1, calendar.monthrange(today.year, today.month+1)[1])
        
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(center__id=payload['center']['id'])
            expired_count = total.filter(expired_date__lte=enddate).count()
            return JsonResponse({'count': expired_count})
        
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(center__id=payload['center']['id'])
            expired_count = total.filter(expired_date__lte=enddate).count()
            return JsonResponse({'count': expired_count})
        # Cục
        ## Từng trung tâm
        elif center_id is not None:
            total = Form.objects.filter(center__id=center_id)
            expired_count = total.filter(expired_date__lte=enddate).count()
            return JsonResponse({'count': expired_count})
        
def Expired2MonthByDepartmentCenter(request):
    today = datetime.today()
    enddate = datetime(today.year, today.month+1, calendar.monthrange(today.year, today.month+1)[1])

    total = Form.objects.filter(expired_date__lte=enddate)
    count = list(total.values('center_id', 'center__city').annotate(count=Count('center_id')))
    return JsonResponse(count, safe=False)

def Expired2MonthByDepartmentDistrict(request):
    today = datetime.today()
    enddate = datetime(today.year, today.month+1, calendar.monthrange(today.year, today.month+1)[1])

    total = Form.objects.filter(expired_date__lte=enddate)
    count = list(total.values('center__city').annotate(count=Count('center__city')))
    return JsonResponse(count, safe=False)

def Expired2MonthAll(request):
    today = datetime.today()
    enddate = datetime(today.year, today.month+1, calendar.monthrange(today.year, today.month+1)[1])

    total = Form.objects.filter(expired_date__lte=enddate).count()
    return JsonResponse(total, safe=False)

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

    def get(self, request, center_id=None, *args, **kwargs):
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
        ## Từng trung tâm
        elif center_id is not None:
            registers = Form.objects.filter(expired_date__lte=enddate, center__id=center_id)
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        ## Tất cả trung tâm
        else:
            registers = Form.objects.filter(expired_date__lte=enddate)
            serializer = FormSerializer(registers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class ExpiringInMonthByCenter(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, center_id=None, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        today = datetime.today()
        startdate = today.replace(day=1)
        # Trung tâm
        if payload['role'] == 'center' and payload['center'] is not None:
            total = Form.objects.filter(expired_date__gte=startdate, center__id=payload['center']['id'])
            count = list(total.values('expired_date__month').annotate(count=Count('expired_date__month')))
            return JsonResponse(count, safe=False)
        elif center_id is not None:
            total = Form.objects.filter(expired_date__gte=startdate, center__id=center_id)
            count = list(total.values('expired_date__month').annotate(count=Count('expired_date__month')))
            return JsonResponse(count, safe=False)

class ExpiringInMonthByCity(APIView):
    serializer_class = FormSerializer
    queryset = Form.objects.all()

    def get(self, request, month, *args, **kwargs):
        token = request.headers.get('Token')
        if not token:
            return HttpResponse('You are not authenticated', status=400)
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            return HttpResponse('Token is not valid', status=400)
        
        # Cục
        if payload['role'] == 'department':
            today = datetime.today()
            startdate = today.replace(day=1)
            print(startdate)
            total = Form.objects.filter(expired_date__gte=startdate, expired_date__month=month)
            count = list(total.values('center__city').annotate(count=Count('center__city')))
            return JsonResponse(count, safe=False)
        else:
            return Response("You are unauthorized", status=status.HTTP_401_UNAUTHORIZED)

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