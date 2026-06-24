from django.urls import path
from pip._internal import locations


from for_admin.views import index, locations

urlpatterns = [
    path('', index, name='index'),
    path('locations/', locations, name='locations'),
]