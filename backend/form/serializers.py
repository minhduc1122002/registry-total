from rest_framework import serializers
from .models import Form
from car.models import Car
from car.serializers import CarSerializer

class FormSerializer(serializers.ModelSerializer):
    car = CarSerializer(allow_null=True)
    class Meta:
        model = Form
        fields = ('register_id', 'register_date', 'expired_date', 'register_place', 'car')