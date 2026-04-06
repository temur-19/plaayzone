from django.shortcuts import render
from django.http import JsonResponse
from .models import Location
# Create your views here.

def locations_api(request):
    data = list(Location.objects.values("name", "lat", "lon"))
    return JsonResponse(data, safe=False)