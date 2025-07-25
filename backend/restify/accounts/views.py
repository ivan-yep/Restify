from .models import RestifyUser
from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RestifyUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.views import View


class RestifyUserCreate(CreateAPIView):
    queryset = RestifyUser.objects.all()
    serializer_class = RestifyUserSerializer
    permission_classes = [AllowAny]


class RestifyUserProfile(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RestifyUserSerializer

    def get_object(self):
        user = get_object_or_404(RestifyUser, username=self.kwargs['username'])
        return user

class RestifyUserProfileID(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RestifyUserSerializer

    def get_object(self):
        user = get_object_or_404(RestifyUser, id=self.kwargs['id'])
        return user
    
class RestifyUserProfileByIDNoAuth(RetrieveAPIView):
    serializer_class = RestifyUserSerializer

    def get_object(self):
        user = get_object_or_404(RestifyUser, id=self.kwargs['id'])
        return user


class RestifyUserEditProfile(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RestifyUserSerializer
    
    def get_object(self):
        user = get_object_or_404(RestifyUser, username=self.kwargs['username'])
        if user.username != self.request.user.username:
            raise PermissionDenied('Unauthorized, cannot edit another user profile')
        return user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        serializer.save()
