from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from apps.map.models import Location
from apps.foruser.api_endpoints.foruser.UpdateMyLocation.serializers import UpdateLocationSerializer



@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def update_delete_location(request, pk):
    try:
        location = Location.objects.get(pk=pk, owner=request.user)
    except Location.DoesNotExist:
        return Response({"detail": "Joylashuv topilmadi."}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "PATCH":
        serializer = UpdateLocationSerializer(location, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        location.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



    
    