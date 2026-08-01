from rest_framework import serializers
from .models import DonationCenter

class DonationCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCenter
        fields = '__all__'