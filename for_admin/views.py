from django.db.models import Model
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from headapp.models import Location


# Create your views here.
@csrf_exempt
def index(request):
    if request.method == 'POST':
        category = request.POST.get('category')
        name = request.POST.get('name')
        lat = request.POST.get('lat')
        lon = request.POST.get('lon')
        description = request.POST.get('description')
        image = request.FILES.get('image')
        new_location = Location.objects.create(
            name=name,
            lat=float(lat),
            lon=float(lon),
            description=description,
            image=image,)
        return render(request, 'admin/admin.html', {'location': new_location})
    return render(request, 'admin/admin.html')

def locations(request):
    locations = Location.objects.all()
    return render(request, 'admin/locations.html', {'locations': locations})
