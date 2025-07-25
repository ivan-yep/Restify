from rest_framework.serializers import ModelSerializer, RelatedField, ValidationError
from .models import Rating
from property.models import Property
from accounts.models import RestifyUser
from reservation.models import Reservation

from django.contrib.contenttypes.models import ContentType

from django.shortcuts import get_object_or_404


class ReceiverField(RelatedField):
    def to_representation(self, value):
        return value.id


class RatingSerializer(ModelSerializer):
    receiver = ReceiverField(read_only=True)

    class Meta:
        model = Rating
        fields = ['reservation',
                  'rater', 
                  'rating',
                  'receiver',
        ]
    
    def create(self, validated_data):  # validated_data is a dict

        reservation = validated_data['reservation']

        receiver_type = self.context.get('view').receiver_type
        if receiver_type == Property:
            receiver_id = reservation.property.id
        elif receiver_type == RestifyUser:
            receiver_id = reservation.guest.id

        # Get receiver_type as ContentType instance.
        receiver_type = ContentType.objects.get_for_model(receiver_type)

        # Add content_type and object_id to form data
        validated_data['receiver_type'] = receiver_type
        validated_data['receiver_id'] = receiver_id

        # Add current user as rater.
        validated_data['rater'] = self.context.get('view').request.user

        return super().create(validated_data)
    
    def validate(self, attrs):
        data = super().validate(attrs)

        receiver_type = self.context.get('view').receiver_type

        reservation = data['reservation']
        this_user = self.context.get('view').request.user

        if receiver_type == Property:
            self.check_is_guest(reservation, this_user)
            self.check_is_complete(reservation)
            self.check_is_first_rating(reservation, this_user)
        
        elif receiver_type == RestifyUser:
            self.check_is_host(reservation, this_user)
            self.check_is_complete(reservation)
            self.check_is_first_rating(reservation, this_user)

        return data
    
    def check_is_guest(self, reservation, user):
        if reservation.guest != user:
            raise ValidationError(
                {'Unauthorized': "You aren't the guest of this reservation."}
            )
        
    def check_is_complete(self, reservation):
        completed_statuses = [Reservation.ReservationStatus.completed,
                              Reservation.ReservationStatus.terminated]
        if reservation.status not in completed_statuses:
            raise ValidationError(
                {'Unauthorized': "This reservation hasn't been completed."}
            )
        
    def check_is_first_rating(self, reservation, user):
        if Rating.objects.filter(reservation=reservation, rater=user).exists():
            raise ValidationError(
                {'Unauthorized':
                 "You already left a rating for this reservation."}
            )
    
    def check_is_host(self, reservation, user):
        if user != reservation.property.owner:
            raise ValidationError(
                {'Unauthorized':
                 "You are not the host of this reservation."}
            )
            