from django.db import models
from django.contrib.auth.models import AbstractUser


def user_directory_path(instance, filename):
    return 'prof_pics/{0}/{1}'.format(instance.username, filename)


class RestifyUser(AbstractUser):
    # user = models.OneToOneField(User)  
    # username = models.CharField(max_length=150)
    # email = models.EmailField(max_length=150)
    tel = models.CharField(max_length=15)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    photo = models.ImageField(upload_to=user_directory_path, default='media/prof_pics/sample-profile-photo.jpg')

    # other fields that may or may not be needed
    user_permissions = models.ForeignKey('auth.Permission', on_delete=models.CASCADE, related_name='restifyuser_permissions', default=None, null=True)
    groups = models.ForeignKey('auth.Group', on_delete=models.CASCADE, related_name='restifyuser_groups', default=None, null=True)

    date_joined = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
