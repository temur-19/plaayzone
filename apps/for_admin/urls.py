from django.contrib.auth import views as auth_views
from django.urls import path

from apps.for_admin.api_endpoints.for_admin.LocationsList.views import LocationListView
from apps.for_admin.api_endpoints.for_admin.LocationCreat.views import LocationCreateView
from apps.for_admin.api_endpoints.for_admin.LocationUpdateDestroy.views import LocationUpdateView, LocationDestroyView
from apps.for_admin.views import login_view, index, logout_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('admin/', index, name='index'),
    path('logout/',logout_view, name='logout'),
    #DRF
    path("api/locations/", LocationListView.as_view(), name="locations"),
    path("api/locations/create/", LocationCreateView.as_view(), name="create"),
    path("api/locations/<int:pk>/update/",LocationUpdateView.as_view(), name="update"),
    path("api/locations/<int:pk>/delete/",LocationDestroyView.as_view(), name="delete"),
]