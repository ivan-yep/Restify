from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError

from .models import Comment
from property.models import Property
from accounts.models import RestifyUser
from reservation.models import Reservation
from .serializers import CommentSerializer 

from django.contrib.contenttypes.models import ContentType

from rest_framework.pagination import PageNumberPagination

# Pagination for all Comment lists
class CommentResultsSetPagination(PageNumberPagination):
    # Default
    page_size = 10
    # Name of the query parameter for controlling page_size
    page_size_query_param = 'page_size'
    max_page_size = 20

    
class CommentGuestsResultsSetPagination(PageNumberPagination):
    # Default
    page_size = 5
    # Name of the query parameter for controlling page_size
    page_size_query_param = 'page_size'
    max_page_size = 20


class ViewCommentsForProperty(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentResultsSetPagination

    def get_queryset(self):
        property = get_object_or_404(Property, id=self.kwargs["property_id"])
        content_type_obj = ContentType.objects.get_for_model(property)

        comments = Comment.objects.filter(receiver_type=content_type_obj,
                                          receiver_id=property.id).order_by("-date_time")

        return comments
    
class ViewRepliesToComment(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentResultsSetPagination

    def get_queryset(self):
        comment = get_object_or_404(Comment, id=self.kwargs["comment_id"])
        content_type_obj = ContentType.objects.get_for_model(comment)

        replies = Comment.objects.filter(receiver_type=content_type_obj,
                                         receiver_id=comment.id).order_by("date_time")

        return replies


class ViewPropertyCommentsOfReservation(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        reservation = get_object_or_404(Reservation, id=self.kwargs["reservation_id"])
        property_content_type = ContentType.objects.get_for_model(Property)

        comments = get_list_or_404(Comment, reservation=reservation,
                                    receiver_type=property_content_type)
        return comments


class ViewCommentsForGuest(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentGuestsResultsSetPagination

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = get_object_or_404(RestifyUser, username=self.kwargs["username"])
        # self.check_if_was_guest(user)

        content_type_obj = ContentType.objects.get_for_model(user)

        # Get comments for <user>
        comments = Comment.objects.filter(receiver_type=content_type_obj,
                                          receiver_id=user.id)
        return comments
    
    def check_if_was_guest(self, user):
        # Check if <user> has/ has had reservation on current user's properties.
        this_user = self.request.user
        stays_with_user = Reservation.objects.filter(property__owner=this_user,
                                                     guest=user)
        if not stays_with_user.exists():
            raise ValidationError(
                {'Unauthorized':
                 'This guest has not stayed at your properties before.'})

        return None


class CommentOnProperty(CreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    permission_classes = [IsAuthenticated]

    receiver_type = Property


class ReplyToComment(CreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    permission_classes = [IsAuthenticated]

    receiver_type = Comment


class CommentOnGuest(CreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    permission_classes = [IsAuthenticated]

    receiver_type = RestifyUser