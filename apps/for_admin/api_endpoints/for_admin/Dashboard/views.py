from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count


from apps.map.models import Location
from apps.foruser.models import CustomUser


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_api(request):
    return Response({
        "total_locations": Location.objects.count(),
        "total_users": CustomUser.objects.count(),
        "locations_by_category": list(
            Location.objects.values('category').annotate(count=Count('id'))
        ),
    })