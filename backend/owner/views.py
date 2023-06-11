from django.shortcuts import render
from rest_framework import viewsets
from .serializers import OwnerSerializer
from .models import Owner
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser 

class OwnerView(APIView):
    serializer_class = OwnerSerializer
    queryset = Owner.objects.all()

    def get(self, request, *args, **kwargs):
        owners = Owner.objects.all()
        serializer = OwnerSerializer(owners, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, *args, **kwargs):
        serializer = OwnerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        owners = Owner.objects.all()
        owners.delete()
        return Response('All Owner Deleted', status=status.HTTP_200_OK)

class OwnerDetailView(OwnerView):
    serializer_class = OwnerSerializer
    queryset = Owner.objects.all()

    def get(self, request, id, *args, **kwargs):
        try:
            car = Owner.objects.get(id=id)
            serializer = OwnerSerializer(car)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id, *args, **kwargs):
        try:
            owner = Owner.objects.get(id=id)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
        
        serializer = OwnerSerializer(owner, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=400)