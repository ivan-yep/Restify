from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import RestifyUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework.response import Response


class RestifyUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=RestifyUser.objects.all())])
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=RestifyUser.objects.all())]
    )
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    tel = serializers.CharField(required=True)

    def validate(self, data):
        password1 = 'password1' in data
        password2 = 'password2' in data

        if (not password1 and password2) or (password1 and not password2):
            raise serializers.ValidationError("Passwords do not match")

        if password1 and password2:
            if data['password1'] != data['password2']:
                raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        user = RestifyUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            tel=validated_data['tel'],
            # photo=validated_data['photo']
        )

        if 'photo' in validated_data.keys():
            if validated_data['photo']:
                user.photo = validated_data['photo']
        user.set_password(validated_data['password1'])
        user.save()

        return user

    class Meta:
        model = RestifyUser
        fields = ('id', 'username', 'tel', 'email', 'password1', 'password2', 'first_name', 'last_name', 'photo')

