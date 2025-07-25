from django.contrib import admin
from .models import Property, PropertyImages, PropertyAmenities

# Register your models here.
admin.site.register(Property)
admin.site.register(PropertyImages)
admin.site.register(PropertyAmenities)