from rest_framework import serializers
from apps.foruser.models import Profile

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'email']