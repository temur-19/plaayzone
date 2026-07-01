from rest_framework.generics import UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAdminUser

from apps.for_admin.api_endpoints.for_admin.LocationUpdateDestroy.serializers import LocationUpdateDestroySerializer
from apps.map.models import Location


class LocationUpdateView(UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Location.objects.all()
    serializer_class = LocationUpdateDestroySerializer
    http_method_names = ['patch']

class LocationDestroyView(DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Location.objects.all()
    serializer_class = LocationUpdateDestroySerializer