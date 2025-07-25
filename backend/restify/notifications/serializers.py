from rest_framework.serializers import ModelSerializer, ValidationError
from .models import Notification
from reservation.models import Reservation
from property.models import Property
from accounts.models import RestifyUser


class UserSerializer(ModelSerializer):
    class Meta:
        model = RestifyUser
        fields = ['username']

class PropertySerializer(ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Property
        fields = [
            'name',
            'owner'
        ]

class ReservationSerializer(ModelSerializer):
    guest = UserSerializer()
    property = PropertySerializer()

    class Meta:
        model = Reservation
        fields = ['guest', 'property', 'start_date', 'end_date', 'price']


class NotificationSerializer(ModelSerializer):
    reservation = ReservationSerializer()

    class Meta:
        model = Notification
        fields = [
            'id',
            'receiver',
            'reservation',
            'notification_type',
            'date_time'
        ]

    def validate(self, attrs):
        data = super().validate(attrs)

        receiver = data['receiver']
        reservation = data['reservation']
        notification_type = data['notification_type']

        if notification_type in [Notification.RESERVE_REQUEST,
                                 Notification.CANCEL_REQUEST]:
            self.check_is_host(reservation, receiver)

        elif notification_type in [Notification.RESERVE_APPROVED,
                                   Notification.CANCEL_APPROVED]:
            self.check_is_guest(reservation, receiver)

        return data
    
    def check_is_host(self, reservation, user):
        if user != reservation.property.owner:
            raise ValidationError(
                {'Invalid recipient':
                 "This user isn't the host of this reservation."}
            )
        
    def check_is_guest(self, reservation, user):
        if reservation.guest != user:
            raise ValidationError(
                {'Invalid recipient':
                 "This user isn't the guest of this reservation."}
            )