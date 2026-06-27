from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAdminUser

from apps.headapp.models import Location
from apps.for_admin.api_endpoints.for_admin.LocationCreat.serializers import LocationCreatSerializer


class LocationCreateView(CreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Location.objects.all()
    serializer_class = LocationCreatSerializer