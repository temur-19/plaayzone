from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from apps.map.models import Location
from apps.foruser.api_endpoints.foruser.GetMyLocations.serializers import GetMyLocationsSerializer



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_locations(request):
    locations = Location.objects.filter(owner = request.user)
    serializer = GetMyLocationsSerializer(locations, many = True)
    print(serializer.data)
    return Response(serializer.data)
    