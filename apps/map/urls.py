from django.urls import path

from apps.map.api_endpoitns.map.ProfileGet.views import get_profile
from apps.map.api_endpoitns.map.ProfileUpdate.views import update_profile
from .views import map_view, logout_view
from apps.map.api_endpoitns.map.LocationsList.views import LocationsListAPIView


app_name = "map"

urlpatterns = [
    path("map/", map_view, name="map"),
    path("api/locations/", LocationsListAPIView.as_view(), name="locations_api"),
    path('api/profile/', get_profile, name='profile_api'),
    path('api/profile/update/', update_profile, name='profile_update_api'),
    path('logout/',logout_view,name="logout"),
]