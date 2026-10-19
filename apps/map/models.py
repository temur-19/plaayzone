from django.db import models
from django.contrib.auth.models import User
from config.settings import AUTH_USER_MODEL
# Create your models here.
class Location(models.Model):
    CATEGORY_CHOICES = [
        ('stadium', 'Mini-stadion'),
        ('playstation', 'Playstation'),
        ('pc_club', 'Kompyuter klub'),
        ('billiard', 'Billiard'),
    ]
    owner = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.SET_DEFAULT,default = None, null=True, blank=True, related_name='locations')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='stadium')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=9, null=False, default = '998')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    lat = models.FloatField()
    lon = models.FloatField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
