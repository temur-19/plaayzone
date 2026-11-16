import re

from django.utils import timezone
from rest_framework import serializers

from apps.map.models import BookingRequest, Location


class BookingRequestSerializer(serializers.ModelSerializer):
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        source="location",
    )

    class Meta:
        model = BookingRequest
        fields = (
            "id",
            "location_id",
            "customer_name",
            "phone_number",
            "requested_at",
            "duration_hours",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")
        extra_kwargs = {
            "customer_name": {"trim_whitespace": True},
            "phone_number": {"trim_whitespace": True},
            "duration_hours": {"min_value": 1, "max_value": 24},
        }

    def validate_customer_name(self, value):
        if not value:
            raise serializers.ValidationError("Ism va familiyangizni kiriting.")
        return value

    def validate_phone_number(self, value):
        if not re.fullmatch(r"\d{9}", value):
            raise serializers.ValidationError(
                "Telefon raqami 9 ta raqamdan iborat bo‘lishi kerak."
            )
        return value

    def validate_requested_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError(
                "Bron vaqti kelajakdagi vaqt bo‘lishi kerak."
            )
        return value
