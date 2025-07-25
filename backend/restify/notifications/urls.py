from django.urls import path 
from . import views 

app_name = 'notifications'
urlpatterns = [
    path('list',
         views.ViewUserNotifications.as_view(), name="view_user_notifications"),
    path('readclear/<int:notification_id>',
         views.ReadClearNotification.as_view(), name="read_clear_notification"),
    ] 