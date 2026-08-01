from django.urls import path
from .views import (
    login_view,
    register_view,
    list_centers,
    book_center,
    add_center,
    get_centers,
    admin_users,
    user_details,
)

urlpatterns = [
    path('login/', login_view),
    path('register/', register_view),
    path('centers/', list_centers),
    path('book/', book_center),

    path('add-center/', add_center),
    path('all-centers/', get_centers),
    path('admin/', admin_users),
    path('userdetails/', user_details),
]