from django.shortcuts import render
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer, ReservationListSerializer, ReservationUpdateSerializer
from django.shortcuts import get_object_or_404
from accounts.models import RestifyUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError, PermissionDenied
from property.models import Property
import datetime 
from django.db.models import Q


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50

class SmallResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

# Create your views here.
class ReservationCreate(CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [AllowAny]


class ReservationList(ListAPIView):
    lookup_url_kwarg = 'username'
    serializer_class = ReservationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        user = RestifyUser.objects.get(username=self.kwargs.get(self.lookup_url_kwarg))

        if user != self.request.user:
            raise PermissionDenied('Cannot access another users reservation page')

        user_type = self.request.query_params.get('user_type')
        status = self.request.query_params.get('status')

        reservations = None
        
        if not user_type or user_type == 'guest':
            reservations = Reservation.objects.filter(guest=user)
        
        elif user_type == 'host':
            reservations = Reservation.objects.filter(property__owner=user)
        
        else:
            raise ValidationError('Invalid user_type filter entered, please enter either host or guest')
        
        for r in reservations:
            if r.status == "P" and r.start_date <= datetime.date.today():
                r.status = "E"
                r.save()

        if status is not None:
            status_list = status.split('/')
            reservations = reservations.filter(status__in=status_list).order_by("-start_date")

        return reservations

class PropertyReservations(ListAPIView):
    lookup_url_kwarg = 'property_id'
    serializer_class = ReservationListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = SmallResultsSetPagination

    def get_queryset(self):
        # Check if the owner of the property is the current logged in user
        selected_property = Property.objects.get(id=self.kwargs.get(self.lookup_url_kwarg))
        if (selected_property.owner != self.request.user):
            raise PermissionDenied('This is not your property')

        status = self.request.query_params.get('status')
        reservations = Reservation.objects.filter(property=selected_property)

        for r in reservations:
            if r.status == "P" and r.start_date <= datetime.date.today():
                r.status = "E"
                r.save()

        if status is not None:
            status_list = status.split('/')
            reservations = reservations.filter(status__in=status_list).order_by("-start_date")

        return reservations 

class GetReservation(RetrieveAPIView):
    serializer_class = ReservationListSerializer

    def get_object(self):
        reservation = get_object_or_404(Reservation, id=self.kwargs['id'])
        return reservation


class ReservationUpdate(RetrieveUpdateAPIView):
    serializer_class = ReservationUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        reservation = get_object_or_404(Reservation, id=self.kwargs['id'])

        if reservation.guest != self.request.user and reservation.property.owner != self.request.user:
            raise PermissionDenied('Unauthorized, you are trying to access a reservation that you are not the owner or guest of')
        
        if reservation.status == 'P' and reservation.start_date < datetime.date.today():
            reservation.status = "E"

        if self.request.method == "GET":
            return reservation
        
        reservation_status = reservation.status

        if 'status' not in self.request.data.keys():
            raise ValidationError({'status': ['This field is required']})

        update_status = self.request.data['status']

        choices = ['P', 'D','E', 'A','CA','CP', 'T', 'CO', 'CD']


        if update_status not in choices:
            raise ValidationError({'status': ['This field is not valid']})
        
        if reservation_status == "E" or reservation_status == "T" or reservation_status == "CA" or reservation_status == "CO":
            raise ValidationError("Cannot modify as this reservation is either expired, terminated, cancelled, or completed")

        if update_status == 'P' or update_status == "E":
            raise ValidationError('Cannot modify as pending or expired. ')

        user = self.request.user
        if user == reservation.guest == reservation.property.owner:
            if update_status == "CP" and reservation_status != "A":
                raise ValidationError("You cannot cancel a reservation that is not approved")
            if (update_status == 'D' or update_status == "A") and reservation_status != 'P':
                raise ValidationError('Invalid action, reservation is already past approval for reservation')
            if (update_status == 'CA' or update_status == 'CD') and reservation_status != 'CP':
                raise ValidationError('Invalid action, no cancellation request is taking place')
            if update_status == "T" and reservation_status != "A":
                raise ValidationError('You cannot terminate an unapproved reservation')
        elif reservation.guest == user:  
            if update_status != "CP":
                raise ValidationError('You cannot set this status as a guest')
            if reservation_status != "A":
                raise ValidationError("You cannot cancel a reservation that is not approved")
        else:
            if (update_status == 'D' or update_status == "A") and reservation_status != 'P':
                raise ValidationError('Invalid action, reservation is already past approval for reservation')
            if (update_status == 'CA' or update_status == 'CD') and reservation_status != 'CP':
                raise ValidationError('Invalid action, no cancellation request is taking place')
            if update_status == "T" and reservation_status != "A":
                raise ValidationError('You cannot terminate an unapproved reservation')
            if update_status == "CP":
                raise ValidationError("You cannot request a cancellation for a reservation. Did you mean to terminate? ")

        if update_status == reservation_status:
            raise ValidationError("The reservation already has this status")

        return reservation

class GetReservationByID(RetrieveAPIView):
    serializer_class = ReservationListSerializer

    def get_object(self):
        reservation = get_object_or_404(Reservation, id=self.kwargs['reservation_id'])
        return reservation