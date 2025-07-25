from django.db import models

from django.contrib.auth.models import User

from accounts.models import RestifyUser
from reservation.models import Reservation

class Notification(models.Model):
    # What a host can receive
    RESERVE_REQUEST = "RR"
    CANCEL_REQUEST = "CR"

    # What a guest can receive
    RESERVE_APPROVED = "RA"
    CANCEL_APPROVED = "CA"

    NOTIFICATION_TYPES = [
        (RESERVE_REQUEST, "Reservation request"),
        (CANCEL_REQUEST, "Cancellation request"),
        (RESERVE_APPROVED, "Reservation approved"),
        (CANCEL_APPROVED, "Cancellation approved")
    ]

    receiver = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE)
    notification_type = models.CharField(
        max_length=2,
        choices=NOTIFICATION_TYPES
    )
    date_time = models.DateTimeField(auto_now_add=True, blank=True)
