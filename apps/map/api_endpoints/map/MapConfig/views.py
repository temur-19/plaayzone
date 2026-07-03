from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def map_config(request):
    return Response({
        "api_key": settings.YANDEX_MAPS_API_KEY
    })