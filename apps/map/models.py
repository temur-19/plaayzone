from django.db import models
from django.contrib.auth.models import User
from config.settings import AUTH_USER_MODEL
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
class Location(models.Model):
    CATEGORY_CHOICES = [
        ('stadium', 'Mini-stadion'),
        ('playstation', 'Playstation'),
        ('pc_club', 'Kompyuter klub'),
        ('billiard', 'Billiard')
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


class BookingRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Kutilmoqda"
        CONFIRMED = "confirmed", "Tasdiqlandi"
        REJECTED = "rejected", "Rad etildi"

    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name="booking_requests",
    )
    customer_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=9)
    requested_at = models.DateTimeField()
    duration_hours = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(24)]
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.location.name} — {self.customer_name}"