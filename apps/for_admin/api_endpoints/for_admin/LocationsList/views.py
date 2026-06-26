from rest_framework.generics import ListAPIView

from apps.headapp.models import Location
from apps.for_admin.api_endpoints.for_admin.LocationsList.serializers import  LocationListSerializer


class LocationListView(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationListSerializer
