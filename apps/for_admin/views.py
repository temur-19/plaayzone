from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout


def login_view(request):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            return redirect("index")
        else:
            return redirect("foruser:home")

    error = None

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.is_superuser:
                login(request, user)
                return redirect("index")
            else:
                error = "Sizda admin panelga kirish huquqi yo'q."
        else:
            error = "Username yoki parol noto'g'ri."

    return render(request, "for_admin/login.html", {"error": error})


@login_required(login_url="login")
def index(request):
    if not request.user.is_superuser:
        return redirect("foruser:home")
    return render(request, 'for_admin/admin.html')


def logout_view(request):
    logout(request)
    return redirect("foruser:home")