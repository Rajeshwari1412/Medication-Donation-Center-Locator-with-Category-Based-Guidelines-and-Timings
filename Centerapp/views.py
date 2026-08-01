from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import DonationCenter
from .serializers import DonationCenterSerializer


# ===============================
# ADD DONATION CENTER (ADMIN)
# ===============================
@api_view(['POST'])
def add_center(request):
    print("DATA RECEIVED:", request.data)  # debug

    serializer = DonationCenterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"msg": "Center added successfully"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# GET ALL CENTERS
# ===============================
@api_view(['GET'])
def get_centers(request):
    centers = DonationCenter.objects.all()
    serializer = DonationCenterSerializer(centers, many=True)
    return Response(serializer.data)


# ===============================
# REGISTER API
# ===============================
@api_view(['POST'])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        password=password,
        is_active=False
    )

    return Response(
        {"msg": "Registration successful. Wait for admin approval"},
        status=status.HTTP_201_CREATED
    )


# ===============================
# LOGIN API
# ===============================
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_active:
            return Response({"error": "Account not approved yet"}, status=status.HTTP_403_FORBIDDEN)

        role = "admin" if user.is_staff else "user"

        return Response({
            "user": {
                "username": user.username,
                "role": role,
                "is_staff": user.is_staff
            },
            "msg": "Login successful"
        })

    return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


# ===============================
# LIST DONATION CENTERS
# ===============================
@api_view(['GET'])
def list_centers(request):
    centers = DonationCenter.objects.all()
    serializer = DonationCenterSerializer(centers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ===============================
# BOOK DONATION CENTER
# ===============================
@api_view(['POST'])
def book_center(request):
    center_name = request.data.get('center')
    name = request.data.get('name')
    phone = request.data.get('phone')

    if not center_name or not name or not phone:
        return Response({"error": "Fill all details"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        center = DonationCenter.objects.get(name=center_name)
    except DonationCenter.DoesNotExist:
        return Response({"error": "Donation center not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response(
        {"msg": f"Booking successful for {center_name}"},
        status=status.HTTP_200_OK
    )