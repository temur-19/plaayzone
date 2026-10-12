from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
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
    phone_number = models.CharField(max_length=9, null=False, default = '998')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    lat = models.FloatField()
    lon = models.FloatField()
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ServiceRating(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_rating',
    )
    score = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(score__gte=1, score__lte=5),
                name='service_rating_score_1_to_5',
            ),
        ]

    def __str__(self):
        return f'{self.user}: {self.score}/5'
