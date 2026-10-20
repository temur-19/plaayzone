from rest_framework import serializers
from apps.map.models import Location


class GetMyLocationsSerializer(serializers.Serializer):
    class Meta:
        model = Location
        field = '__all__'


    