from rest_framework.generics import UpdateAPIView, DestroyAPIView

from apps.for_admin.api_endpoints.for_admin.LocationUpdateDestroy.serializers import LocationUpdateDestroySerializer
from apps.headapp.models import Location


class LocationUpdateView(UpdateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationUpdateDestroySerializer

class LocationDestroyView(DestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationUpdateDestroySerializer