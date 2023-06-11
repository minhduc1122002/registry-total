from rest_framework import serializers
from .models import Car
from owner.models import Owner
from owner.serializers import OwnerSerializer

class CarSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(allow_null=True)
    class Meta:
        model = Car
        fields = ('registration_id', 'registration_place', 'registration_date', 'plate_number', 'purpose',
                    'type', 'manufacturer', 'model', 'engine_number', 'chassis_number', 'owner', 'inspection_status')