from rest_framework import serializers

from apps.headapp.models import Location
class LocationUpdateDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'