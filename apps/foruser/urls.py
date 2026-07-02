from django.urls import path,reverse_lazy
from rest_framework_simplejwt.views import TokenRefreshView


from .api_endpoints.foruser.Login.views import login_api
from .api_endpoints.foruser.Register.views import signup_api
from django.contrib.auth import views as auth_views

app_name = 'foruser'

urlpatterns = [
    path('login/', login_api, name='login'),
    path('signup/', signup_api, name='signup'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password_reset/',
         auth_views.PasswordResetView.as_view(
             template_name='foruser/password_reset.html',
             email_template_name='foruser/password_reset_email.html',
             html_email_template_name='foruser/password_reset_email.html',
             success_url=reverse_lazy('foruser:password_reset_done')
         ),
         name='password-reset'),

    path('password-reset/done/',
         auth_views.PasswordResetDoneView.as_view(
             template_name='foruser/password_reset_done.html',
         ),
         name='password_reset_done'),

    path('password-reset-confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='foruser/password_reset_confrim.html',
         ),
         name='password_reset_confirm'),

    path('password-reset-complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='foruser/password_reset_complete.html',
         ),
         name='password_reset_complete'),
]