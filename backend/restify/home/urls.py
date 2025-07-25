from django.urls import path 
from . import views 

app_name = 'home'
urlpatterns = [
    path('', views.ViewProperties.as_view(), name='viewproperties'),
    path('<int:pk>', views.PropertyDetails.as_view(), name='propertydetails'),
] 
