from rest_framework import serializers
from accounts.models import RestifyUser
from .models import Reservation
from property.models import Property
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from notifications.models import Notification
from django.utils import timezone
# import datetime


class ReservationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = (
            'status',
        )
    
    def update(self, instance, validated_data):
        if validated_data['status'] == 'CA':
            Notification.objects.create(
                receiver=instance.guest,
                notification_type=Notification.CANCEL_APPROVED,
                reservation=instance
            )
        elif validated_data['status'] == 'CR':
            Notification.objects.create(
                receiver=instance.property.host,
                notification_type=Notification.CANCEL_REQUEST,
                reservation=instance
            )
        elif validated_data['status'] == 'A':
            Notification.objects.create(
                receiver=instance.guest,
                notification_type=Notification.RESERVE_APPROVED,
                reservation=instance
            )

        status_to_update = validated_data['status']
        if validated_data['status'] == 'CD':
            status_to_update = 'A'

        instance.status = status_to_update
        instance.save()
        return instance


class ReservationSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(required=True)
    end_date = serializers.DateField(required=True)
    class Meta:
        model = Reservation
        fields = (
            'start_date', 
            'end_date'
        )
    
    def validate(self, data):
        property = get_object_or_404(Property, id=self.context.get('view').kwargs.get('property'))

        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError('invalid dates, please try again')
        
        property_reservations = Reservation.objects.filter(property=property)

        for r in property_reservations:
            if r.status == 'A' or r.status == 'CP' or r.status == 'CO':
                if data['start_date'] >= r.start_date and data['start_date'] <= r.end_date:
                    raise serializers.ValidationError('start date is not valid, it needs to be in an available time')
                
                if data['end_date'] >= r.start_date and data['end_date'] <= r.end_date:
                    raise serializers.ValidationError('end date is not valid, it needs to be in an available time')

        return data

    def create(self, validated_data):
        get_user = self.context.get('request').user

        property = get_object_or_404(Property, id=self.context.get('view').kwargs.get('property'))
        price = property.price
        nights_stayed = validated_data['end_date'] - validated_data['start_date']
        total_price = nights_stayed.days * price
        host = property.owner

        new_reservation = Reservation.objects.create(
            guest=get_user, 
            property=property,
            start_date=validated_data['start_date'],
            end_date=validated_data['end_date'],
            price=total_price,
        )

        Notification.objects.create(
            receiver=host,
            notification_type=Notification.RESERVE_REQUEST,
            reservation=new_reservation
        )

        return new_reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestifyUser
        fields = ['id', 'username', 'photo']

class PropertySerializer(serializers.ModelSerializer):
    owner = UserSerializer()

    class Meta:
        model = Property
        fields = [
            'id',
            'name',
            'owner'
        ]

class ReservationListSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    guest = UserSerializer()

    class Meta:
        model = Reservation
        fields = (
            'id',
            'status', 
            'start_date', 
            'end_date',
            'price',
            'property',
            'guest',
        )