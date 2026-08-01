from django.db import models

class DonationCenter(models.Model):
    center_name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    contact = models.CharField(max_length=15)
    timings = models.CharField(max_length=100)
    categories = models.CharField(max_length=200)
    donation_type = models.CharField(max_length=50)
    guidelines = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.center_name