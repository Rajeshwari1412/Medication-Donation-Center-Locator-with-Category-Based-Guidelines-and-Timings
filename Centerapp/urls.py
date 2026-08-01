from django.urls import path
from .views import (
    login_view,
    register_view,
    list_centers,
    book_center,
    add_center,
    get_centers
)

urlpatterns = [
    # 🔐 Authentication
    path('login/', login_view),
    path('register/', register_view),

    # 📍 Donation Centers
    path('centers/', list_centers),
    path('all-centers/', get_centers),

    # 🏥 Admin - Add Center
    path('add-center/', add_center),

    # 📅 Booking
    path('book/', book_center),
]