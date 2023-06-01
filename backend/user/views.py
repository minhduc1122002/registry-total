from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

class RegisterView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
        
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
