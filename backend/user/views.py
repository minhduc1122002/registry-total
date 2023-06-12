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
        # token = request.headers.get('Token')
        # if not token:
        #     return Response('You are not authenticated', status=400)
        # try:
        #     payload = jwt.decode(token, 'secret', algorithms='HS256')
        # except jwt.ExpiredSignatureError:
        #     return Response('Token is not valid', status=400)
        
        # if payload['role'] == 'department':
            if request.data.get('role') is not None and request.data['role'] == 'department':
                request.data['center'] = None
                serializer = UserSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                if request.data.get("center") is None or request.data['center'] is None:
                    return Response('Center is None', status=400)
            else:
                try:
                    center = Center.objects.get(id=request.data['center']['id'])
                except:
                    center = None

                if center is None:
                    center_serializer = CenterSerializer(center, data=request.data['center'])
                    if center_serializer.is_valid():
                        center = Center(**request.data['center'])
                        center.save()
                    else:
                        return Response(center_serializer.errors, status=400)
                else:
                    return Response('This center already had an account', status=400)
                
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
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # else:
        # return Response('You are not authenticated', status=400)

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
    
class UserView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(role='center')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetailView(UserView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
    
    def get_center(self, request, user):
        if request.data.get("center") is None or request.data['center'] is None:
            return user.center
        
        center_request = request.data['center']
        try:
            center = Center.objects.get(id=center_request['id'])
        except:
            center = user.center
            
        center_serializer = CenterSerializer(center, data=center_request)
            
        if center_serializer.is_valid():
            center = Center(**request.data['center'])
            return center
        else:
            return center_serializer.errors
        
    def put(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=username)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)
        
        user_data = request.data.copy()
        

        if request.data.get('oldpassword') is not None and request.data.get('newpassword') is not None:
            if not user.check_password(request.data['oldpassword']):
                return Response('Incorrect Old Password', status=status.HTTP_400_BAD_REQUEST)
            else:
                user.set_password(request.data['newpassword'])

        center = self.get_center(request, user)

        if not isinstance(center, Center):
            return Response(center, status=400)
        
        user_data['center'] = None
        
        serializer = UserSerializer(user, data=user_data, partial=True)
        
        if serializer.is_valid():
            user.center = center
            user.username = user_data['username']
            center.save()
            user.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=400)
    
    def delete(self, request, username, *args, **kwargs):
        try:
            user = User.objects.get(username=str(username))
            center = Center.objects.get(id=user.center.id)
            center.delete()
            user.delete()
            return Response('User Deleted', status=status.HTTP_200_OK)
        except:
            return Response('Not Found', status=status.HTTP_400_BAD_REQUEST)

