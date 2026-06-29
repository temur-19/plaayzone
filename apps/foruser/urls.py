from django.urls import path,reverse_lazy
from .views import log_in, signup, home
from django.contrib.auth import views as auth_views

app_name = 'foruser'

urlpatterns = [
    path('',home,name='home'),
    path('login/', log_in, name='login'),
    path('signup/', signup, name='signup'),
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