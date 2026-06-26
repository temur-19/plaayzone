from django.contrib import auth
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordResetForm
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect

from headapp.models import Location
from .forms import RegisterForm
from django.contrib.auth import login, authenticate
from django.contrib import messages
from headapp.models import Location
from .models import CustomUser



# Create your views here.


def home(request):
    locations = Location.objects.count
    users = CustomUser.objects.count
    return render(request,'foruser/home.html',{'locations':locations,
                                                                            'users':users})
def log_in(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            # Redirect to a success page.
            return redirect('headapp:map')
            ...
        else:
            # Return an 'invalid login' error message.
            messages.error(request,"login yoki parol xato")
    return render(request,'foruser/login.html',{'form':RegisterForm})


def signup(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('foruser:login')
        else:
            print(form.errors)
    else:
        form = RegisterForm()
    return render(request,'foruser/signup.html',{'form':form})
