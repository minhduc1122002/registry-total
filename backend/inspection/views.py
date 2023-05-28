from django.shortcuts import render
from rest_framework import viewsets
from car.serializers import CarSerializer
from car.models import Car
from owner.models import Owner
from owner.serializers import OwnerSerializer
from .serializers import InspectionSerializer
from .models import Inspection
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser 
from django.forms.models import model_to_dict

class InspectionView(APIView):
    serializer_class = InspectionSerializer
    queryset = Inspection.objects.all()

    def get(self, request, *args, **kwargs):
        inspections = Inspection.objects.all()
        serializer = InspectionSerializer(inspections, many=True)
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
                return Response(owner_serializer.errors, status=400)

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
        
        if request.get("car") is None or request['car'] is None is None:
            return Response('Car is None', status=400)
        
        try:
            car = Car.objects.get(registration_number=request.data['car']['registration_number'])
        except:
            car = None
        
        if car is None:
            car = self.check_car(request)
            
        inspection_data = request.data.copy()
        inspection_data['car'] = None
        
        inspection_serializer = InspectionSerializer(data=inspection_data)
        
        if inspection_serializer.is_valid():
            inspection_data['car'] = car
            inspection = Inspection(**inspection_data)
            inspection.save()
            response = model_to_dict(inspection)
            response['car'] = model_to_dict(inspection.car)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(inspection_serializer.errors, status=400)
    
class InspectionDetailView(InspectionView):
    serializer_class = InspectionSerializer
    queryset = Inspection.objects.all()

    def get(self, request, id, *args, **kwargs):
        try:
            inspection = Inspection.objects.get(inspection_number=id)
            serializer = InspectionSerializer(inspection)
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
            return Response(owner_serializer.errors, status=400)
    
    def check_car(self, request, inspection):
        if request.data.get("car") is None or request.data['car'] is None:
            return inspection.car
        
        car_request = request.data['car']
        try:
            car = Car.objects.get(registration_number=car_request['registration_number'])
            owner = self.check_owner(car_request, car)
            
        except:
            car = inspection.car
            owner = self.check_owner(car_request, car)
            
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
    
    def put(self, request, id, *args, **kwargs):
        if not request.data:
            return Response('Empty Body', status=400)
        
        try:
            inspection = Inspection.objects.get(inspection_number=id)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)

        car = self.check_car(request, inspection)

        inspection_data = request.data.copy()
        inspection_data['car'] = None
        
        inspection_serializer = InspectionSerializer(inspection, data=inspection_data)
        
        if inspection_serializer.is_valid():
            inspection_data['car'] = car
            
            inspection = Inspection(**inspection_data)
            inspection.save()
            response = model_to_dict(inspection)
            response['car'] = model_to_dict(car)
            response['car']['owner'] = model_to_dict(car.owner)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(inspection_serializer.errors, status=400)
