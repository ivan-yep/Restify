from django.urls import path 
from . import views 

app_name = 'property'
urlpatterns = [
    path('list', views.GetUserProperties.as_view(), name='listproperties'),
    path('create', views.CreateProperty.as_view(), name='createproperty'),
    path('<int:pk>/delete', views.DeleteProperty.as_view(), name='deleteproperty'),
    path('<int:pk>/edit', views.EditProperty.as_view(), name='editproperty ')
] 
