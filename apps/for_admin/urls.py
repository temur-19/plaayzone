from django.contrib.auth import views as auth_views
from django.urls import path

from apps.for_admin.api_endpoints.for_admin.LocationsList.views import LocationListView
from apps.for_admin.api_endpoints.for_admin.LocationCreat.views import LocationCreateView
from apps.for_admin.api_endpoints.for_admin.LocationUpdateDestroy.views import LocationUpdateView, LocationDestroyView
from apps.for_admin.api_endpoints.for_admin.Dashboard.views import dashboard_api
from apps.for_admin.api_endpoints.for_admin.Login.views import admin_login
from apps.for_admin.api_endpoints.for_admin.Logout.views import admin_logout_api

app_name = 'for_admin'
urlpatterns = [
    path('login/', admin_login, name='login'),
    path('admin/', dashboard_api, name='index'),
    path('logout/',admin_logout_api, name='logout'),
    #DRF
    path("api/locations/", LocationListView.as_view(), name="locations"),
    path("api/locations/create/", LocationCreateView.as_view(), name="create"),
    path("api/locations/<int:pk>/update/",LocationUpdateView.as_view(), name="update"),
    path("api/locations/<int:pk>/delete/",LocationDestroyView.as_view(), name="delete"),
]