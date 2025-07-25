from rest_framework.serializers import ModelSerializer, RelatedField, ValidationError
from .models import Comment
from property.models import Property
from accounts.models import RestifyUser
from reservation.models import Reservation

from django.contrib.contenttypes.models import ContentType

from django.shortcuts import get_object_or_404

class ReceiverField(RelatedField):
    def to_representation(self, value):
        return value.id

class CommentSerializer(ModelSerializer):
    receiver = ReceiverField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id',
                  'reservation',
                  'commenter', 
                  'receiver',
                  'comment',
                  'date_time',
                  'rating']

    def validate(self, attrs):
        data = super().validate(attrs)
        
        receiver_type = self.context.get('view').receiver_type
        
        reservation = data['reservation']
        this_user = self.context.get('view').request.user

        if receiver_type == Property:
            self.check_is_guest(reservation, this_user)
            self.check_is_complete(reservation)
            self.check_is_first_comment(reservation, this_user)
            
        elif receiver_type == Comment:
            self.check_is_guest_or_host(reservation, this_user)
            self.check_is_complete(reservation)
            self.check_is_not_latest_replier(reservation, this_user)

        elif receiver_type == RestifyUser:
            self.check_is_host(reservation, this_user)
            self.check_is_complete(reservation)
            self.check_is_first_comment_for_guest(reservation)

        return data

    def create(self, validated_data):   # validated_data is a dict
       
        reservation = validated_data['reservation']

        receiver_type = self.context.get('view').receiver_type
        if receiver_type == Property:
            receiver_id = reservation.property.id
        elif receiver_type == Comment:
            receiver_id = Comment.objects.filter(reservation=reservation).order_by('date_time')[0].id
        elif receiver_type == RestifyUser:
            receiver_id = reservation.guest.id

        # Get receiver_type as ContentType instance.
        receiver_type = ContentType.objects.get_for_model(receiver_type)

        # Add content_type and object_id to form data
        validated_data['receiver_type'] = receiver_type
        validated_data['receiver_id'] = receiver_id

        # Add current user as the commenter
        validated_data['commenter'] = self.context.get('view').request.user

        return super().create(validated_data)
    
    def check_is_guest(self, reservation, user):
        if reservation.guest != user:
            raise ValidationError(
                {'Unauthorized': "You aren't the guest of this reservation."}
            )
    
    def check_is_property(self, reservation, property):
        if reservation.property != property:
            raise ValidationError(
                {'Unauthorized': "This isn't the property of the reservation."}
            )
        
    def check_is_complete(self, reservation):
        completed_statuses = [Reservation.ReservationStatus.completed,
                              Reservation.ReservationStatus.terminated]
        if reservation.status not in completed_statuses:
            raise ValidationError(
                {'Unauthorized': "This reservation hasn't been completed."}
            )
        
    def check_is_first_comment(self, reservation, user):
        if Comment.objects.filter(reservation=reservation, commenter=user).exists():
            raise ValidationError(
                {'Unauthorized': "You already commented for this reservation."}
            )
    
    def check_is_guest_or_host(self, reservation, user):
        if not (reservation.property.owner == user or reservation.guest == user):
            raise ValidationError(
                {'Unauthorized':
                 "You are not the guest or host of this reservation."}
            )
    
    def check_is_not_latest_replier(self, reservation, user):
        comments = Comment.objects.filter(reservation=reservation).order_by('-date_time')
        if not comments.exists():
            raise ValidationError(
                {'Unauthorized': "There is no comment to reply to."}
            )
        
        latest_comment = comments[0]
        if user == latest_comment.commenter:
            raise ValidationError(
                {'Unauthorized': "There is no new comment to reply to."}
            )

    def check_is_host(self, reservation, user):
        if user != reservation.property.owner:
            raise ValidationError(
                {'Unauthorized':
                 "You are not the host of this reservation."}
            )
        
    def check_is_first_comment_for_guest(self, reservation):
        comments_for_guest = Comment.objects.filter(
            reservation=reservation,
            receiver_type=ContentType.objects.get_for_model(RestifyUser),
            receiver_id=reservation.guest.id
        )
        if comments_for_guest.exists():
            raise ValidationError(
                {'Unauthorized':
                 "You already commented on this guest for this reservation."}
            )
