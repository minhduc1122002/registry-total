from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from form.models import Center
from form.serializers import CenterSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
import jwt, datetime
from django.forms.models import model_to_dict

class RegisterView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
        
    def post(self, request, *args, **kwargs):
        if request.data.get('role') is not None and request.data['role'] != 'department':
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
            
            user_data = request.data.copy()
            user_data['center'] = None

            serializer = UserSerializer(data=user_data)
            
            if serializer.is_valid():
                user_data['center'] = center
                user = User(**user_data)
                user.set_password(user_data['password'])
                user.save()
                response = serializer.data
                response['center'] = model_to_dict(user.center)
                return Response(response, status=status.HTTP_201_CREATED)
        else:
            request.data['center'] = None
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        try:
            user = User.objects.get(username=username)
        except:
            return Response('Your username is incorrect', status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(password):
            return Response('Your password is incorrect', status=status.HTTP_400_BAD_REQUEST)

        if user.role == 'department':
            payload = {
                'id': user.username,
                'role': user.role,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
        else:
            payload = {
                'id': user.username,
                'role': user.role,
                'center': model_to_dict(user.center),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }

        token = jwt.encode(payload, "secret", algorithm="HS256")

        response = Response()

        # response.set_cookie(key='jwt', value=token, httponly=True)
        serializers = UserSerializer(user)
        response.data = {
            'jwt': token
        }
        return response

