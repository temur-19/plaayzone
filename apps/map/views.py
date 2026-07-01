from django.shortcuts import render, redirect
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import logout

from .models import Location
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm
from apps.foruser.models import Profile
    

@login_required(login_url='/login/')
def map_view(request):
    context = {
        'api_key': settings.YANDEX_MAPS_API_KEY
    }
    return render(request, 'map/index.html', context)


def logout_view(request):
    logout(request)
    return redirect('foruser:login')