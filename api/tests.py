from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class BackendApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_endpoint_accepts_profile_fields(self):
        response = self.client.post(
            "/api/register/",
            {
                "username": "alice",
                "password": "secret123",
                "email": "alice@example.com",
                "mobile": "9876543210",
                "address": "New Delhi",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])

        user = User.objects.get(username="alice")
        self.assertEqual(user.email, "alice@example.com")
        self.assertTrue(user.is_active)

    def test_admin_users_endpoint_lists_registered_users(self):
        User.objects.create_user(
            username="bob",
            password="secret123",
            email="bob@example.com",
            is_active=True,
        )

        response = self.client.get("/api/admin/")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(item["username"] == "bob" for item in response.json()["users"]))
