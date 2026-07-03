from django.urls import path

from apps.map.api_endpoints.map.ProfileGet.views import get_profile
from apps.map.api_endpoints.map.ProfileUpdate.views import update_profile
from apps.map.api_endpoints.map.LocationsList.views import LocationsListAPIView
from apps.map.api_endpoints.map.MapConfig.views import map_config


app_name = "map"

urlpatterns = [
    path("config/", map_config, name="config"),
    path("api/locations/", LocationsListAPIView.as_view(), name="locations_api"),
    path('api/profile/', get_profile, name='profile_api'),
    path('api/profile/update/', update_profile, name='profile_update_api'),
]