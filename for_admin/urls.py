from django.contrib.auth.views import LogoutView
from django.urls import path
from pip._internal import locations
from rest_framework.views import APIView

from for_admin.api_endpoints.for_admin.LocationsList.views import LocationListView
from for_admin.api_endpoints.for_admin.LocationCreat.views import LocationCreateView
from for_admin.api_endpoints.for_admin.LocationUpdateDestroy.views import LocationUpdateView, LocationDestroyView
from for_admin.views import index,login_view

urlpatterns = [
    path('', index, name='index'),
    path("accounts/login/", login_view, name="login"),

    #DRF
    path("api/locations", LocationListView.as_view(), name="locations"),
    path("api/locations/create/", LocationCreateView.as_view(), name="create"),
    path("api/locations/<int:pk>/update/",LocationUpdateView.as_view(), name="update"),
    path("api/locations/<int:pk>/delete/",LocationDestroyView.as_view(), name="delete"),
]