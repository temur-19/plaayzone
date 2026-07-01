from apps.map.api_endpoitns.map.LocationsList.serializers import LocationsSerializers
from rest_framework.generics import ListAPIView

from apps.map.models import Location

class LocationsListAPIView(ListAPIView):
    serializer_class = LocationsSerializers

    def get_queryset(self):
        queryset = Location.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset
    