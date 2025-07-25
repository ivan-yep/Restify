from rest_framework import serializers
from .models import Property, PropertyImages, PropertyAmenities
from django.db.models import Q


class PropertyImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = PropertyImages
        fields = ['id', 'image']

class PropertyAmenitiesSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = PropertyAmenities
        fields = ['id', 'amenity']


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True)
    amenities = PropertyAmenitiesSerializer(many=True, required=False)

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'address',
            "city",
            "country",
            'num_bedrooms',
            'num_bathrooms',
            'num_guests',
            'price',
            'description',
            'amenities',
            'images'
        ]

    # Validate the data
    def validate(self, data):
        errors = {}
        data = super().validate(data)

        if 'num_guests' in data and data['num_guests'] < 0:
            errors['num_guests'] = 'Please enter a positive integer'
        if 'num_bedrooms' in data and data['num_bedrooms'] < 0:
            errors['num_bedrooms'] = 'Please enter a positive integer'
        if 'num_bathrooms' in data and data['num_bathrooms'] < 0:
            errors['num_bathrooms'] = 'Please enter a positive integer'
        if 'price' in data and data['price'] < 0:
            errors['price'] = 'Please enter a positive value'
        if 'amenities' in data:
            amenities = data['amenities']

            # Generate list of amenities given 
            amenity_list = []
            for amenity in amenities:
                amenity_list.append(amenity.get('amenity'))

            # Check if unique
            if len(amenity_list) != len(set(amenity_list)):
                errors['amenities'] = 'Cannot have the same amenity twice for a property'

        if errors:
            raise serializers.ValidationError(errors)
        return data

    # Creates a property
    def create(self, validated_data):
        user = self.context.get('request').user

        # Get validated data
        name = validated_data.get('name')
        address = validated_data.get('address')
        city = validated_data.get('city')
        country = validated_data.get('country')
        num_bedrooms = validated_data.get('num_bedrooms')
        num_bathrooms = validated_data.get('num_bathrooms')
        num_guests = validated_data.get('num_guests')
        description = validated_data.get('description')
        price = validated_data.get('price')

        # Create a new property based on this data
        new_property = Property.objects.create(
            name=name,
            address=address,
            city=city,
            country=country,
            num_bedrooms=num_bedrooms,
            num_bathrooms=num_bathrooms,
            num_guests=num_guests,
            description=description,
            owner=user,
            price=price
        )

        # Once property is created, create amenities
        given_amenities = validated_data.get('amenities')
        if given_amenities:
            for amenity in given_amenities:
                PropertyAmenities.objects.create(property=new_property, **amenity)

        # Once property is created, create images
        given_images = validated_data.get('images')
        for image in given_images:
            PropertyImages.objects.create(property=new_property, **image)

        return new_property
        
    def update(self, instance, validated_data):
        # Get the given amenities from the query
        given_amenities, given_images = [], []

        if 'amenities' in validated_data:
            given_amenities = validated_data.pop('amenities')
            
            # Delete old amenities 
            PropertyAmenities.objects.filter(property=instance).delete()
            for amenity_data in given_amenities:
                PropertyAmenities.objects.create(property=instance, amenity=amenity_data.get('amenity'))
        
        # Get the given images from the query - these are 
        if 'images' in validated_data:
            given_images = validated_data.pop('images')

            # These are ids of the images that should not be deleted, all other images for the property should be deleted
            image_ids_to_keep = []
            for image_data in given_images:
                if image_data.get('id') is not None:
                    image_ids_to_keep.append(image_data.get('id'))

            # Delete old images 
            PropertyImages.objects.filter(property=instance).exclude(id__in=image_ids_to_keep).delete()

            # Create new images
            for image_data in given_images:
                if image_data.get('image') is not None:
                    PropertyImages.objects.create(property=instance, image=image_data.get('image'))

        # Update property values itself
        return super(PropertySerializer, self).update(instance, validated_data)
