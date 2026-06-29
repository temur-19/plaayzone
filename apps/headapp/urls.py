from django.urls import path
from .views import map_view,locations_api, profile_view, logout_view


app_name = "headapp"

urlpatterns = [
    path("map/", map_view, name="map"),
    path("api/locations/", locations_api, name="locations_api   "),
    path('profile/',profile_view,name="profile"),
    path('logout/',logout_view,name="logout"),
]