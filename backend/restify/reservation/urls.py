from django.urls import path 
from . import views 


app_name = 'reservation'
urlpatterns = [
    path('<int:property>/create', views.ReservationCreate.as_view(), name='create'),
    path('<str:username>/list', views.ReservationList.as_view(), name='list'),
    path('<int:id>/update', views.ReservationUpdate.as_view(), name='update'),
    path('property/<int:property_id>', views.PropertyReservations.as_view(), name='id_list'),
    path('<int:reservation_id>/get', views.GetReservationByID.as_view(), name='get_reservation_by_id'),
    path('<int:id>', views.GetReservation.as_view(), name='reservation')
] 