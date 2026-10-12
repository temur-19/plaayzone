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

@pytest.mark.django_db
def test_service_rating_is_public_to_read_and_requires_login_to_submit(api_client):
    response = api_client.get('/head/api/service-rating/')

    assert response.status_code == 200
    assert response.data == {'average': None, 'count': 0, 'my_rating': None}
    assert api_client.post('/head/api/service-rating/', {'score': 5}).status_code == 401

@pytest.mark.django_db
def test_service_rating_updates_existing_user_rating(api_client):
    user = User.objects.create_user(username='rating-user', password='test-password')
    api_client.force_authenticate(user=user)

    first_response = api_client.post('/head/api/service-rating/', {'score': 4})
    second_response = api_client.post('/head/api/service-rating/', {'score': 5})

    assert first_response.status_code == 200
    assert second_response.data == {'average': 5.0, 'count': 1, 'my_rating': 5}
    user.refresh_from_db()
    assert user.service_rating.score == 5

    another_user = User.objects.create_user(username='another-rating-user', password='test-password')
    api_client.force_authenticate(user=another_user)
    average_response = api_client.post('/head/api/service-rating/', {'score': 4})

    assert average_response.data == {'average': 4.5, 'count': 2, 'my_rating': 4}

@pytest.mark.django_db
def test_service_rating_rejects_scores_outside_one_to_five(api_client):
    user = User.objects.create_user(username='rating-range-user', password='test-password')
    api_client.force_authenticate(user=user)

    assert api_client.post('/head/api/service-rating/', {'score': 0}).status_code == 400
    assert api_client.post('/head/api/service-rating/', {'score': 6}).status_code == 400