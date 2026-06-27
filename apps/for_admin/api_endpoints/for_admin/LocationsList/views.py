from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from apps.headapp.models import Location
from apps.for_admin.api_endpoints.for_admin.LocationsList.serializers import  LocationListSerializer


class LocationListView(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Location.objects.all()
    serializer_class = LocationListSerializer
