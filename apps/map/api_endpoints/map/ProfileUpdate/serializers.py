from rest_framework import serializers
from apps.foruser.models import Profile

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'avatar', 'phone_number']