from rest_framework import serializers
from .models import Inspection
from car.models import Car
from car.serializers import CarSerializer

class InspectionSerializer(serializers.ModelSerializer):
    car = CarSerializer(allow_null=True)
    class Meta:
        model = Inspection
        fields = ('inspection_number', 'inspection_date', 'expiration_date', 'inspection_center', 'car')