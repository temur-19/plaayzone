from django.test import TestCase

# Create your tests here.
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.map.models import Location, BookingRequest

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username='admin',
        password='admin123'
    )

@pytest.mark.django_db
def test_locations_list(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    response = api_client.get('/head/api/locations/')
    assert response.status_code == 200

@pytest.mark.django_db
def test_create_unauthorized(api_client):
    response = api_client.post('/management/api/locations/create/', {})
    assert response.status_code == 403


@pytest.mark.django_db
def test_create_booking_request(api_client):
    location = Location.objects.create(
        name="PlayZone Stadium",
        category="stadium",
        price="50000.00",
        lat=41.3111,
        lon=69.2797,
    )
    requested_at = timezone.now() + timedelta(days=1)

    response = api_client.post(
        "/head/api/bookings/",
        {
            "location_id": location.id,
            "customer_name": "Ali Valiyev",
            "phone_number": "901234567",
            "requested_at": requested_at.isoformat(),
            "duration_hours": 2,
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["status"] == BookingRequest.Status.PENDING
    assert response.data["location_id"] == location.id
    assert BookingRequest.objects.count() == 1


@pytest.mark.django_db
def test_create_booking_request_rejects_past_time(api_client):
    location = Location.objects.create(
        name="PlayZone Stadium",
        category="stadium",
        price="50000.00",
        lat=41.3111,
        lon=69.2797,
    )

    response = api_client.post(
        "/head/api/bookings/",
        {
            "location_id": location.id,
            "customer_name": "Ali Valiyev",
            "phone_number": "901234567",
            "requested_at": (timezone.now() - timedelta(hours=1)).isoformat(),
            "duration_hours": 2,
        },
        format="json",
    )

    assert response.status_code == 400
    assert BookingRequest.objects.count() == 0