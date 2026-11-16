from django.contrib import admin
from .models import BookingRequest, Location

# Register your models here.


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('CATEGORY_CHOICES','name', 'lat', 'lon', 'description', 'created_at','image')
    list_filter = ('name',)
    search_fields = ('name',)


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    list_display = (
        "location",
        "customer_name",
        "phone_number",
        "requested_at",
        "duration_hours",
        "status",
        "created_at",
    )
    list_filter = ("status", "requested_at")
    search_fields = ("location__name", "customer_name", "phone_number")