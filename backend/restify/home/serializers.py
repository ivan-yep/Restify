from rest_framework import serializers
from property.models import Property, PropertyImages, PropertyAmenities
from comments.models import Comment
from ratings.models import Rating
from accounts.models import RestifyUser
from reservation.models import Reservation
from django.db.models import Avg, Value, Q
from django.db.models.functions import Coalesce

# Get the images of a property
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImages
        fields = ['image']

# Get the user for a comment, rating or the owner
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestifyUser
        fields = ['username', 'first_name', 'last_name', 'tel', 'email', 'photo']

# Get the amenities for a property
class PropertyAmenitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAmenities
        fields = ['amenity']

# Only get the comments that have been made to a property
class FilterCommentSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        receiver_type_property=6
        receiver_type_comment=10
        data = data.filter(Q(receiver_type=receiver_type_property) | Q(receiver_type=receiver_type_comment))
        return super(FilterCommentSerializer, self).to_representation(data)
    
# Get the comments of a property
class PropertyCommentsSerializer(serializers.ModelSerializer):
    commenter = UserSerializer()

    class Meta:
        list_serializer_class = FilterCommentSerializer
        model = Comment
        fields = ['comment', 'date_time', 'receiver_type', 'commenter']

# Only get the ratings that have been made to a property
class FilterRatingSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        receiver_type_selected=6
        data = data.filter(receiver_type=receiver_type_selected)
        return super(FilterRatingSerializer, self).to_representation(data)

# Get the ratings of a property
class PropertyRatingsSerializer(serializers.ModelSerializer):
    rater = UserSerializer()

    class Meta:
        list_serializer_class = FilterRatingSerializer
        model = Rating
        fields = ['rating', 'receiver_type', 'rater']

# Used in collobation with the reservation serializer - only need reservations that have been completed
class FilterReservationSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        approved_status_code="A"
        data = data.filter(status=approved_status_code)
        return super(FilterReservationSerializer, self).to_representation(data)
    
# Reservation serializer for home view    
class PropertyReservationHomeSerializer(serializers.ModelSerializer):
    class Meta:
        list_serializer_class = FilterReservationSerializer
        model = Reservation
        fields = ['status', 'start_date', 'end_date']


# Reservation serializer for detail view 
class PropertyReservationsSerializer(serializers.ModelSerializer):
    ratings = PropertyRatingsSerializer(many=True)
    comments = PropertyCommentsSerializer(many=True)

    class Meta:
        model = Reservation
        fields = ['status', 'guest', 'start_date', 'end_date', 'price', 'ratings', 'comments']

# Get all the details for the property 
class DetailPropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True)
    reservations = PropertyReservationsSerializer(many=True)
    amenities = PropertyAmenitiesSerializer(many=True)
    average_rating = serializers.SerializerMethodField()
    owner = UserSerializer()

    def get_average_rating(self, obj):
        average_rating = Property.objects.annotate(avg_rating=(Coalesce(Avg('reservations__comments__rating'), Value(0.0)))).filter(Q(reservations__comments__receiver_type=6) | Q(reservations__comments__receiver_type__isnull = True) & Q(id=obj.id)).order_by("avg_rating")
        average_rating = average_rating[0].avg_rating
        return average_rating

    class Meta:
        model = Property
        fields = [
            'id',
            'images',  
            'name', 
            'address', 
            "city",
            "country",
            "average_rating",
            'num_bedrooms', 
            'num_bathrooms', 
            'num_guests', 
            'price',
            'description', 
            'amenities',
            'reservations',
            'owner'
        ]

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True)
    average_rating = serializers.SerializerMethodField()
    amenities = PropertyAmenitiesSerializer(many=True)
    approved_reservations = PropertyReservationHomeSerializer(many=True, source='reservations')

    def get_average_rating(self, obj):
        average_rating = Property.objects.annotate(avg_rating=(Coalesce(Avg('reservations__comments__rating'), Value(0.0)))).filter(Q(reservations__comments__receiver_type=6) | Q(reservations__comments__receiver_type__isnull = True)).order_by("avg_rating").filter(Q(id=obj.id))
        average_rating = average_rating[0].avg_rating
        return average_rating
    
    class Meta:
        model = Property
        fields = [
            'id',
            'images',  
            'name', 
            'address', 
            "city",
            "country",
            "average_rating",
            'num_bedrooms', 
            'num_bathrooms', 
            'num_guests', 
            'price',
            'amenities',
            'approved_reservations'
        ]  