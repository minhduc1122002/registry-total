from rest_framework import serializers
from .models import Form, Center
from car.models import Car
from car.serializers import CarSerializer

class CenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Center
        fields = ('id', 'address', 'city', 'district')

class FormSerializer(serializers.ModelSerializer):
    car = CarSerializer(allow_null=True)
    center = CenterSerializer(allow_null=True)
    class Meta:
        model = Form
        fields = ('register_id', 'register_date', 'expired_date', 'center', 'car')