from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from .forms import RegisterForm
from django.contrib.auth import login, authenticate
from django.contrib import messages


# Create your views here.


def index(request):
    return render(request,'Userregistration/nimadir.html')

def log_in(request):
    if request.method == 'POST':
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            return redirect('index')
            ...
        else:
            # Return an 'invalid login' error message.
            messages.error(request,"login yoki parol xato")
    return render(request,'Userregistration/login.html')


def signup(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
        else:
            print(form.errors)
    else:
        form = RegisterForm()
    return render(request,'Userregistration/signup.html',{'form':form})


