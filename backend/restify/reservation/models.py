from django.db import models
from accounts.models import RestifyUser
from property.models import Property
from django.utils import timezone


# Create your models here.
class Reservation(models.Model):
    class ReservationStatus(models.TextChoices):
        # for the reserving process
        pending = 'P', 'pending'
        denied = 'D', 'denied'
        expired = 'E', 'expired'
        approved = 'A', 'approved'
        cancel_approved = 'CA', 'cancel approved'
        cancel_denied = 'CD', 'cancel_denied'
        cancel_pending = 'CP', 'cancel pending'
        terminated = 'T', 'terminated'
        completed = 'CO', 'completed'
    
    status = models.CharField(max_length=2, choices=ReservationStatus.choices, default=ReservationStatus.pending)
    guest = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='guest')
    # host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='host')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reservations')
    price = models.FloatField(blank=False)
    start_date =  models.DateField(blank=False)
    end_date = models.DateField(blank=False)
    date_submitted = models.DateField(default=timezone.now)
