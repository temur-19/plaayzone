from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth import authenticate, login, logout


def login_view(request):
    if request.user.is_authenticated and request.user.is_superuser:
        return redirect("index")

    error = None

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            if user.is_superuser:
                login(request, user)
                return redirect("index")
            else:
                error = "Sizda dmin panelga kirish huquqi yo'q."
        else:
            error = "Username yoki parol noto'g'ri."

    return render(request, "for_admin/login.html", {"error": error})

# Create your views here.



