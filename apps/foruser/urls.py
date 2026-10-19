from django.urls import path,reverse_lazy
from rest_framework_simplejwt.views import TokenRefreshView

from .api_endpoints.foruser.AddLocation.views import AddLocationView
from .api_endpoints.foruser.Login.views import login_api
from .api_endpoints.foruser.Logout.views import logout_api
from .api_endpoints.foruser.Register.views import signup_api
from django.contrib.auth import views as auth_views

app_name = 'foruser'

urlpatterns = [
    path('login/', login_api, name='login'),
    path('signup/', signup_api, name='signup'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/locations/create/user/", AddLocationView.as_view(), name="create_user"),
    path('logout/', logout_api, name='logout'),
    ]