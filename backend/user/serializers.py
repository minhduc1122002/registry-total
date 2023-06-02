from rest_framework import serializers
from .models import User
from form.serializers import CenterSerializer

class UserSerializer(serializers.ModelSerializer):
    center = CenterSerializer(allow_null=True)
    class Meta:
        model = User
        fields = ('username', 'password', 'role', 'center')
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user