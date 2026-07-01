from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from apps.map.api_endpoitns.map.ProfileUpdate.serializers import ProfileUpdateSerializer


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile = request.user.profile
    serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)