from rest_framework.generics import ListAPIView

from headapp.models import Location
from for_admin.api_endpoints.for_admin.LocationsList.serializers import  LocationListSerializer


class LocationListView(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationListSerializer