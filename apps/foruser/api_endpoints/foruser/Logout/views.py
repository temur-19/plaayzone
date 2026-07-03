from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from apps.foruser.api_endpoints.foruser.Logout.serializers import LogoutSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    serializer = LogoutSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        token = RefreshToken(serializer.validated_data['refresh'])
        token.blacklist()
    except TokenError:
        return Response({"error": "Yaroqsiz yoki muddati o'tgan token"}, status=400)

    return Response({"detail": "Chiqildi"})