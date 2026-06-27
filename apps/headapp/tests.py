from django.test import TestCase

# Create your tests here.
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

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