# headapp/views.py
from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view

from .models import Location
from django.contrib.auth.decorators import login_required
from .forms import ProfileForm
from Userregistration.models import Profile
from rest_framework import generics
from rest_framework.response import Response
from .serializers import LocationSerializer
    

@api_view(['GET'])
def locations_api(request):
    category = request.GET.get("category")

    locations = Location.objects.all()

    if category:
        locations = locations.filter(category=category)


    serializer = LocationSerializer(locations, many=True, context={'request': request})
    print(serializer.data)
    return Response(serializer.data)

def map_view(request):
    context = {
        'api_key': settings.YANDEX_MAPS_API_KEY
    }
    return render(request, 'headapp/index.html', context)

@login_required
def profile_view(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
        return redirect('headapp:map')  # saqlangach mapga qaytadi

    return redirect('headapp:map')
def logout_view(request):
    return redirect('Userregistration:login')

