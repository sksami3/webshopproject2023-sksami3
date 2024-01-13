from rest_framework import serializers
from .models import AppUser

class AppUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'username', 'password', 'email']
        # extra_kwargs = {
        #     'password': {'write_only': True},  # Set password field as write-only
        # }
