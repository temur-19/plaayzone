from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.foruser.api_endpoints.foruser.Register.serializers import RegisterSerializer
from rest_framework.decorators import api_view
from rest_framework import status


@api_view(['POST'])
def signup_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'refresh': str(refresh),
                'access': str(refresh.access_token)},
                status=201)
    return Response(serializer.errors, status=400)


