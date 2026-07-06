from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from apps.for_admin.api_endpoints.for_admin.Login.serializers import LoginSerializer

@api_view(['POST'])

def admin_login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
    if user is None:
        return Response({"error":"username yoki parol xato"}, status = 401)
    if not user.is_staff:
        return Response({"error":"admin panelga kirish huquqi yo'q"}, status = 401)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "token": str(refresh.access_token),
        "user":{"username":user.username,
                "id":user.id,
                }
    })
