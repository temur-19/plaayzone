from struct import error

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.foruser.api_endpoints.foruser.Login.serializers import LoginSerializer
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework import status



@api_view(['POST'])
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
    if user is None:
        return Response({"error":"Login yoki parol xato"},status=401)
    refresh = RefreshToken.for_user(user)
    return Response({"refresh":str(refresh),
                     "access":str(refresh.access_token),
                     "user":{"id":user.id,
                             "username":user.username,
                             "is_superuser":user.is_superuser,
                             }})
