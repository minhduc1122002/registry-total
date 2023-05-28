from rest_framework import serializers
from .models import Car
from owner.models import Owner
from owner.serializers import OwnerSerializer

class CarSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(allow_null=True)
    class Meta:
        model = Car
        fields = ('registration_place', 'registration_date', 'registration_number', 'purpose',
                    'type', 'manufacturer', 'model', 'owner')