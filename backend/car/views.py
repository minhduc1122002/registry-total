from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CarSerializer
from .models import Car
from owner.models import Owner
from owner.serializers import OwnerSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser 
from django.forms.models import model_to_dict

class CarView(APIView):
    serializer_class = CarSerializer
    queryset = Car.objects.all()

    def get(self, request, *args, **kwargs):
        cars = Car.objects.all()
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def check_owner(self, request):
        if request.data.get('owner') is None or request.data['owner'] is None:
            return Response('Owner is None', status=400)
        try:
            owner = Owner.objects.get(id=request.data['owner']['id'])
        except:
            owner = None
        
        if owner is None:
            owner_serializer = OwnerSerializer(owner, data=request.data['owner'])
            if owner_serializer.is_valid():
                owner = Owner(**request.data['owner'])
                owner_serializer.save()
            else:
                return owner_serializer.errors
        return owner

    def post(self, request, format=None):
        if not request.data:
            return Response('Empty Body', status=400)
        
        owner = self.check_owner(request)
        if not isinstance(owner, Owner):
            return Response(owner, status=400)
        
        car_data = request.data.copy()
        car_data['owner'] = None
        
        car_serializer = CarSerializer(data=car_data)
        
        if car_serializer.is_valid():
            car_data['owner'] = owner
            car = Car(**car_data)
            car.save()
            response = model_to_dict(car)
            response['owner'] = model_to_dict(owner)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(car_serializer.errors, status=400)

class CarDetailView(CarView):
    serializer_class = CarSerializer
    queryset = Car.objects.all()

    def get(self, request, id, *args, **kwargs):
        try:
            car = Car.objects.get(registration_number=str(id))
            serializer = CarSerializer(car)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)

    def check_owner(self, request, car):
        if request.data.get("owner") is None or request.data['owner'] is None:
            return car.owner
        try:
            owner = Owner.objects.get(id=request.data['owner']['id'])
            owner_serializer = OwnerSerializer(owner, data=request.data['owner'])

        except:
            owner_serializer = OwnerSerializer(car.owner, data=request.data['owner'])

        if owner_serializer.is_valid():
            owner = Owner(**request.data['owner'])
            owner_serializer.save()

        return owner
    
    def put(self, request, id, *args, **kwargs):
        if not request.data:
            return Response('Empty Body', status=400)
        
        try:
            car = Car.objects.get(registration_number=id)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)

        owner = self.check_owner(request, car)

        car_data = request.data.copy()
        car_data['owner'] = None
        
        car_serializer = CarSerializer(car, data=car_data)
        
        if car_serializer.is_valid():
            car_data['owner'] = owner
            car = Car(**car_data)
            car.save()
            response = model_to_dict(car)
            response['owner'] = model_to_dict(owner)
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(car_serializer.errors, status=400)