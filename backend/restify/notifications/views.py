from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveDestroyAPIView
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import ValidationError
from rest_framework.response import Response
from collections import OrderedDict

from .models import Notification
from property.models import Property
from accounts.models import RestifyUser
from .serializers import NotificationSerializer

from rest_framework.pagination import PageNumberPagination
from rest_framework.pagination import CursorPagination

# Pagination for all Notification lists
class NotificationResultsSetPagination(PageNumberPagination):
    # Default
    page_size = 5
    # Name of the query parameter for controlling page_size
    page_size_query_param = 'page_size'
    max_page_size = 20


class CursorSetPagination(CursorPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    cursor_query_param = 'cursor'
    ordering = '-date_time'

    def paginate_queryset(self, queryset, request, view=None):
        self.count = self.get_count(queryset)
        return super().paginate_queryset(queryset, request, view)

    def get_count(self, queryset):
        """
        Determine an object count, supporting either querysets or regular lists.
        """
        try:
            return queryset.count()
        except (AttributeError, TypeError):
            return len(queryset)

    def get_paginated_response(self, data):
        return Response(
            OrderedDict(
                [
                    ("next", self.get_next_link()),
                    ("previous", self.get_previous_link()),
                    ("count", self.count),
                    ("results", data),
                ]
            )
        )


class ViewUserNotifications(ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = CursorSetPagination
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        notifications = \
            Notification.objects.all().filter(receiver=self.request.user)
        return notifications


# GET request: Display's notification
# DELETE request: Delete's notification
class ReadClearNotification(RetrieveDestroyAPIView):
    serializer_class = NotificationSerializer

    permission_classes = [IsAuthenticated]

    def get_object(self):
        notification = get_object_or_404(Notification,
                                         id=self.kwargs["notification_id"])
        self.check_if_for_user(notification)
        return notification
    
    def check_if_for_user(self, notification):
        if notification.receiver != self.request.user:
            raise ValidationError(
                {'Unauthorized':
                 "You may only access your own notifications."}
            )
        
