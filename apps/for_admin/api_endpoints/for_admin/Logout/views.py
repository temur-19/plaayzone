from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_logout_api(request):
    return Response({"detail": "Chiqildi"})