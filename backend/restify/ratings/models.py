from django.db import models

from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from accounts.models import RestifyUser
from reservation.models import Reservation

class Rating(models.Model):
    # Rating values
    class Rates(models.IntegerChoices):
        TERRIBLE = 1
        BAD = 2
        GOOD = 3
        GREAT = 4
        AMAZING = 5

    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='ratings')
    # Blank=True so that it can be implicitly set in serializer
    rater = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, blank=True)
    rating = models.PositiveIntegerField(choices=Rates.choices)

    # For referencing the receiver of the rating
    receiver_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    receiver_id = models.PositiveIntegerField()
    receiver = GenericForeignKey('receiver_type', 'receiver_id')

