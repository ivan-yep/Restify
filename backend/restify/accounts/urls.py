from django.urls import path 
from . import views 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


app_name = 'accounts'
urlpatterns = [
    path('logout', TokenRefreshView.as_view(), name='logout'),
    path('login', TokenObtainPairView.as_view(), name='login'),
    path('register', views.RestifyUserCreate.as_view(), name='register'), 
    path('<str:username>/profile', views.RestifyUserProfile.as_view(), name='profile'),
    path('profile/<int:id>', views.RestifyUserProfileID.as_view(), name='profile_id'),
    path('profile/no_auth/<int:id>', views.RestifyUserProfileByIDNoAuth.as_view(), name='profile_id_no_auth'),
    path('<str:username>/profile/edit', views.RestifyUserEditProfile.as_view(), name='profile-edit'),
    # path('<str:username>/id', views.RestifyUserID.as_view(), name='profileID')
] 