from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.map.api_endpoints.map.BookingRequest.serializers import (
    BookingRequestSerializer,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_booking_request(request):
    serializer = BookingRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    booking_request = serializer.save()
    return Response(
        BookingRequestSerializer(booking_request).data,
        status=status.HTTP_201_CREATED,
    )


