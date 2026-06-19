from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm

from .models import CustomUser,Profile

admin.site.register(CustomUser)
admin.site.register(Profile)

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email')

# Register your models here.


