from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.map.api_endpoints.map.ServiceRating.serializers import (
    ServiceRatingInputSerializer,
)
from apps.map.models import ServiceRating


class ServiceRatingAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        ratings = ServiceRating.objects.aggregate(
            average=Avg('score'),
            count=Count('id'),
        )
        my_rating = None
        if request.user.is_authenticated:
            my_rating = ServiceRating.objects.filter(user=request.user).values_list(
                'score',
                flat=True,
            ).first()
        average = ratings['average']
        return Response({
            'average': round(average, 1) if average is not None else None,
            'count': ratings['count'],
            'my_rating': my_rating,
        })

    def post(self, request):
        serializer = ServiceRatingInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rating, _ = ServiceRating.objects.update_or_create(
            user=request.user,
            defaults={'score': serializer.validated_data['score']},
        )
        aggregate = ServiceRating.objects.aggregate(
            average=Avg('score'),
            count=Count('id'),
        )
        return Response({
            'average': round(aggregate['average'], 1),
            'count': aggregate['count'],
            'my_rating': rating.score,
        }, status=status.HTTP_200_OK)
