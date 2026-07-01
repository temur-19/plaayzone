from rest_framework import serializers
from apps.map.models import Location

class LocationCreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'