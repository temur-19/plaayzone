from apps.foruser.api_endpoints.foruser.AddLocation.serializers import AddLocationSerializer
from rest_framework.generics import CreateAPIView
from apps.map.models import Location


class AddLocationView(CreateAPIView):
    queryset = Location.objects.all()
    serializer_class = AddLocationSerializer