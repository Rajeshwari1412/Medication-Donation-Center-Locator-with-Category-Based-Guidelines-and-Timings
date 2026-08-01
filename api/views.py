from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import DonationCenter
from .serializers import DonationCenterSerializer


def _serialize_user(user):
    return {
        "username": user.username,
        "email": user.email,
        "mobile": getattr(user, "mobile", ""),
        "address": getattr(user, "address", ""),
        "approved": 1 if user.is_active else 0,
    }


# ✅ REGISTER
@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    email = request.data.get('email', '')
    mobile = request.data.get('mobile', '')
    address = request.data.get('address', '')

    user = User.objects.create_user(username=username, password=password, is_active=True)
    user.email = email
    user.mobile = mobile
    user.address = address
    user.save(update_fields=['email'])

    return Response({"success": True, "message": "Registration successful", "user": _serialize_user(user)})


# ✅ LOGIN
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password)

    if user:
        if not user.is_active:
            return Response({"error": "Account not approved yet"}, status=403)

        role = "admin" if user.is_staff else "user"

        return Response({
            "user": {
                "username": user.username,
                "role": role,
                "is_staff": user.is_staff
            },
            "msg": "Login successful"
        })

    return Response({"error": "Invalid username or password"}, status=401)


# ✅ LIST CENTERS (USER VIEW)
@api_view(['GET'])
def list_centers(request):
    centers = DonationCenter.objects.all()
    serializer = DonationCenterSerializer(centers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def admin_users(request):
    users = User.objects.all().order_by('id')
    return Response({"users": [_serialize_user(user) for user in users]})


@api_view(['GET'])
def user_details(request):
    username = request.GET.get('username')
    if not username:
        return Response({"error": "Username is required"}, status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    return Response({"user": _serialize_user(user)})


# ✅ BOOK CENTER
@api_view(['POST'])
def book_center(request):
    center_name = request.data.get('center')
    name = request.data.get('name')
    phone = request.data.get('phone')

    if not center_name or not name or not phone:
        return Response({"error": "Fill all details"}, status=400)

    return Response({"msg": "Booking successful"})


@api_view(['POST'])
def add_center(request):
    try:
        center_name = request.data.get('name')   # 👈 map name → center_name
        address = request.data.get('address')
        contact = request.data.get('contact')
        categories = request.data.get('categories')
        timings = request.data.get('timings')

        center = DonationCenter.objects.create(
            center_name=center_name,   # ✅ correct field
            address=address,
            contact=contact,
            categories=categories,
            timings=timings,
            donation_type="General"   # 👈 required field (must give)
        )

        return Response({"msg": "Center added successfully"})

    except Exception as e:
        return Response({"error": str(e)})

# ✅ GET CENTERS (FOR MAP / DASHBOARD)
@api_view(['GET'])
def get_centers(request):
    centers = DonationCenter.objects.all()
    serializer = DonationCenterSerializer(centers, many=True)
    return Response(serializer.data)