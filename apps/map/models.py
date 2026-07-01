from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Location(models.Model):
    CATEGORY_CHOICES = [
        ('stadium', 'Mini-stadion'),
        ('playstation', 'Playstation'),
        ('pc_club', 'Kompyuter klub'),
        ('billiard', 'Billiard'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='stadium')
    name = models.CharField(max_length=100)
    lat = models.FloatField()
    lon = models.FloatField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
