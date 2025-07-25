from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from accounts.models import RestifyUser
from reservation.models import Reservation

class Comment(models.Model):
    reservation = models.ForeignKey(Reservation, on_delete=models.CASCADE, related_name='comments')
   
    # blank=True so that it can be implicitly set in serializer.
    commenter = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, blank=True)

    # For referencing the receiver of the comment
    receiver_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    receiver_id = models.PositiveIntegerField()
    receiver = GenericForeignKey('receiver_type', 'receiver_id')
    
    comment = models.CharField(max_length=1000)
    date_time = models.DateTimeField(auto_now_add=True, blank=True)

    # New. Merged Rating model.
    # Rating values
    class Rates(models.IntegerChoices):
        TERRIBLE = 1
        BAD = 2
        GOOD = 3
        GREAT = 4
        AMAZING = 5

    rating = models.PositiveIntegerField(choices=Rates.choices, null=True, blank=True)


