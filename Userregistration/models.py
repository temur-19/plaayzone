from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, blank=True, null=True)
    agree_to_terms = models.BooleanField(default=False)