from django import forms
from django.db.models import Avg, Value, Q
from django.db.models.functions import Coalesce
from django.core.exceptions import ValidationError


from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers

from .serializers import DetailPropertySerializer, PropertySerializer
from property.models import Property

import datetime

# Pagination for the view properties 
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50

# Searh all properties
class ViewProperties(ListAPIView):
    serializer_class = PropertySerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self, *args, **kwargs):
        queryset = Property.objects.all()

        try:
            order = forms.CharField(required=False).clean(self.request.query_params.get('order')).strip().lower()
            by = forms.CharField(required=False).clean(self.request.query_params.get('by')).strip().lower()
            num_guest = forms.IntegerField(required=False).clean(self.request.query_params.get('guests'))
            num_beds = forms.IntegerField(required=False).clean(self.request.query_params.get('bedrooms'))
            num_baths = forms.IntegerField(required=False).clean(self.request.query_params.get('bathrooms'))
            location = forms.CharField(required=False).clean(self.request.query_params.get('city')).strip().lower().capitalize()
            amenities = forms.CharField(required=False).clean(self.request.query_params.get('amenities')).strip()
            start_date = forms.DateField(required=False).clean(self.request.query_params.get('available_from'))
            end_date = forms.DateField(required=False).clean(self.request.query_params.get('available_to'))
        except ValidationError as error:
            raise serializers.ValidationError({"error": error.message}) 
    
        errors={}
        # Check for errors first
        if num_guest is not None and num_guest < 0:
            errors['guests'] = "Please enter a positive value"
        if num_beds is not None and num_beds < 0:
            errors['bedrooms'] ="Please enter a positive value"
        if num_baths is not None and num_baths < 0:
            errors['bathrooms'] ="Please enter a positive value"
        if by != "" and by not in ['price', 'rating']:
            errors['by'] = "By must be either price or rating"
        if order != "" and order not in ['ascending', 'descending']:
            errors['order'] = 'Order must be either ascending or descending'
        # if start_date is None and end_date is not None or start_date is not None and end_date is None:
        #     errors['available_from'] = 'Please provide both available_from and available_to'
        #     errors['available_to'] = 'Please provide both available_from and available_to'
        if start_date is not None and end_date is not None:
            if end_date <= start_date:
                errors['available_to'] = 'Available to must be greater than available from'
            if start_date < datetime.datetime.now().date():
                errors['available_from'] = 'Available from must be greater than or equal to today\'s date'

        if errors:
            raise serializers.ValidationError(errors)

        # Order ascending/descending by rating or price
        if by != "" and by == "price":
            if order != "" and order == "descending":
                queryset = queryset.order_by("-price")
            else:
                queryset = queryset.order_by("price")
        
        elif by != "" and by == "rating":
            if order != "" and order == "ascending":
                queryset = queryset.annotate(avg_rating=(Coalesce(Avg('reservations__comments__rating'), Value(0.0)))).filter(Q(reservations__comments__receiver_type=6) | Q(reservations__comments__receiver_type__isnull = True)).order_by("avg_rating")
            else:
                queryset = queryset.annotate(avg_rating=(Coalesce(Avg('reservations__comments__rating'), Value(0.0)))).filter(Q(reservations__comments__receiver_type=6) | Q(reservations__comments__receiver_type__isnull = True)).order_by("-avg_rating")

        # Filter based on number of guests, beds and baths
        if num_guest is not None:
            queryset = queryset.filter(num_guests__gte=num_guest)
        if num_beds is not None:
            queryset = queryset.filter(num_bedrooms__gte=num_beds)
        if num_baths is not None:
            queryset = queryset.filter(num_bathrooms__gte=num_baths)
        
        # Filter based on location (city)
        if location != "":
            queryset = queryset.filter(city=location)
        
        # Filter based on the amenities - input is expected to be a forward slash separated list (i.e. <amenity1>/<amenity2>/<amenity3>)
        if amenities != "":
            amenities_list = amenities.split('/')
            queryset = queryset.filter(amenities__amenity__in=amenities_list)
        
        # Filter based on given start and end date 
        # Have to check for approved reservations in the given range
        if start_date is not None and end_date is not None:
            queryset = queryset.exclude(Q(reservations__end_date__gte=start_date) & Q(reservations__start_date__lte=end_date) & Q(reservations__status='A'))

        return queryset.distinct()

# Get all the details of a property
class PropertyDetails(RetrieveAPIView):
    queryset = Property.objects.all()
    serializer_class = DetailPropertySerializer