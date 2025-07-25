from django.db import models
from django.conf import settings
from accounts.models import RestifyUser

# Property details for a property owned by <user>
class Property(models.Model):
    name = models.CharField(max_length=200, blank=False)
    address = models.CharField(max_length=200, blank=False)
    city = models.CharField(max_length=100, blank=False)
    country = models.CharField(max_length=100, blank=False)
    num_bedrooms = models.PositiveIntegerField(blank=False)    
    num_bathrooms = models.PositiveIntegerField(blank=False)
    num_guests = models.PositiveIntegerField(blank=False)
    description = models.TextField(blank=False)
    price = models.FloatField(blank=False)
    owner = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='owner')

# Amenities for a property
class PropertyAmenities(models.Model):
    AMENITY_CHOICES = [
        ("Pool", "Pool"),
        ("Wi-Fi", "Wi-Fi"),
        ("Air Conditioning", "Air Conditioning"),
        ("Heating", "Heating"),
        ("Pets Allowed", "Pets Allowed"),
        ("Washer and Dryer", "Washer and Dryer"),
        ("Jacuzzi", "Jacuzzi"),
        ("Free Parking", "Free Parking"),
        ("Equipped Kitchen", "Equipped Kitchen"),
        ("Fireplace", "Fireplace")
    ]
    amenity = models.CharField(max_length=30, choices=AMENITY_CHOICES)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='amenities')

    class Meta:
        unique_together = ('amenity', 'property',)


# Generate file name for where the property image needs to be saved (MEDIA_ROOT/property_images/user_<id>/<filename>) 
def user_directory_path(instance, filename):
    return 'property_images/property_{0}/{1}'.format(instance.property.id, filename)

# Images for a particular property
class PropertyImages(models.Model):
    image = models.ImageField(upload_to=user_directory_path)
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
