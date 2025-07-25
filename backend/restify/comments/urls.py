from django.urls import path 
from . import views 

app_name = 'comments'
urlpatterns = [
     path('property/<int:property_id>/list',
          views.ViewCommentsForProperty.as_view(), name='view_comments_for_property'),
     path('replies/<int:comment_id>/list',
         views.ViewRepliesToComment.as_view(), name='view_replies_to_comment'),
     path('property/reservation/<int:reservation_id>',
         views.ViewPropertyCommentsOfReservation.as_view(), name='view_property_comment_of_reservation'),
     path('user/<str:username>/list',
          views.ViewCommentsForGuest.as_view(), name='view_comments_for_guest'),
     path('property/write',
          views.CommentOnProperty.as_view(), name='comment_on_property'),
     path('property/reply/write',
          views.ReplyToComment.as_view(), name='reply_to_comment'),
     path('user/write',
          views.CommentOnGuest.as_view(), name='comment_on_guest'),
    ] 
