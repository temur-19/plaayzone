from rest_framework.generics import CreateAPIView

from apps.headapp.models import Location
from apps.for_admin.api_endpoints.for_admin.LocationCreat.serializers import LocationCreatSerializer


class LocationCreateView(CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationCreatSerializer