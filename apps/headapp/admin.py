from django.contrib import admin
from .models import Location

# Register your models here.


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('CATEGORY_CHOICES','name', 'lat', 'lon', 'description', 'created_at','image')
    list_filter = ('name',)
    search_fields = ('name',)