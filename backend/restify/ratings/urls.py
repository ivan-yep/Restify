from django.urls import path 
from . import views 

app_name = 'ratings'
urlpatterns = [
    path('property/<int:property_id>/list',
         views.ViewRatingsForProperty.as_view(), name='view_ratings_for_property'),
    path('user/<int:user_id>/list',
         views.ViewRatingsForGuest.as_view(), name='view_ratings_for_guest'),
    path('property/rate',
         views.RateProperty.as_view(), name='rate_property'),
    path('user/rate',
         views.RateUser.as_view(), name='rate_user'),
    ] 
    