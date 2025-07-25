from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from .serializers import PropertySerializer
from .models import Property
from rest_framework.exceptions import PermissionDenied

# Get all the properties owned by the logged in user
class GetUserProperties(ListAPIView):
    lookup_url_kwarg = 'username'
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        properties = Property.objects.filter(owner=self.request.user)
        return properties 
    
# Create a property 
class CreateProperty(CreateAPIView):
    queryset = Property.objects.all() 
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

# Update a property 
class EditProperty(RetrieveUpdateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property_to_update = get_object_or_404(Property, id=self.kwargs['pk'])
        if property_to_update.owner != self.request.user:
            raise PermissionDenied({"error": "Cannot edit a property that you do not own"})
        return property_to_update

# Delete a property
class DeleteProperty(DestroyAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        property_to_delete = get_object_or_404(Property, id=self.kwargs['pk'])
        if property_to_delete.owner != self.request.user:
            raise PermissionDenied({"error": "Cannot delete a property that you do not own"})
        return property_to_delete

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"success": "Property deleted successfully"})

    def perform_destroy(self, instance):
        instance.delete()