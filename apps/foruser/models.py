from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=11, blank=True, null=True)
    agree_to_terms = models.BooleanField(default=False)


class Profile(models.Model):
    user = models.OneToOneField(
        CustomUser,  # django User emas, o'zingizning model
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(default='default.jpg', upload_to='profile_pics')
    phone_number = models.CharField(max_length=11, blank=True, null=True)

    def __str__(self):
        return self.user.username