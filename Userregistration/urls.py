from django.urls import path
from .views import log_in, signup, home

app_name = 'Userregistration'

urlpatterns = [
    path('',home,name='home'),
    path('login/', log_in, name='login'),
    path('signup/', signup, name='signup'),
]