from rest_framework.generics import CreateAPIView, ListAPIView

from headapp.models import Location
from for_admin.api_endpoints.for_admin.LocationCreat.serializers import LocationCreatSerializer


class LocationCreateView(CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationCreatSerializer