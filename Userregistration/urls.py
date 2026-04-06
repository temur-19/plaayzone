from django.urls import path
from headapp.views import locations_api
from .views import log_in, signup,index


urlpatterns = [
    path('index',index,name='index'),
    path('', log_in, name='login'),
    path('signup', signup, name='signup'),
    path('api/locations/', locations_api),
]