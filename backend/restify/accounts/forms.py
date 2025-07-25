
from django import forms
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .models import RestifyUser


class LoginForm(forms.Form):
    username = forms.CharField(max_length=150, required=False)
    password = forms.CharField(widget=forms.PasswordInput(), required=False)

    def clean(self):
        data = super().clean()
        if not data['username'] or not data['password']: 
            raise ValidationError({
                'username' : 'Username or password is invalid, please fill'}
            )
        else:
            user = RestifyUser.objects.all()
            user = authenticate(username=data['username'], password=data['password'])
            if not user:
                raise ValidationError({
                    'username' : 'Username or password is invalid'}
                )
            data['user'] = user
        return data


class RegisterForm(forms.Form): 
    username = forms.CharField(required=False)
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.CharField(widget=forms.EmailInput, required=False)
    password1 = forms.CharField(widget=forms.PasswordInput, required=False)
    password2 = forms.CharField(widget=forms.PasswordInput, required=False)

    class Meta:
        model = RestifyUser
    
    def clean(self):
        data = super().clean()

        username = data['username']
        password1 = data['password1']
        password2 = data['password2']

        # error checking 
        errors = {}
        if not username or username == "":
            errors['username'] = 'This field is required'
            # raise ValidationError({
            #         'username' : 'This field is required'}
            #     )
        if not password1 or password1 == "":
            errors['password1'] = 'This field is required'
            # raise ValidationError({
            #         'password1' : 'This field is required'}
            #     )
        if not password2 or password2 == "":
            errors['password2'] = 'This field is required'
            # raise ValidationError({
            #         'password2' : 'This field is required'}
            #     )

        if errors != {}:
            raise ValidationError(errors)

        if password1 != password2:
            raise ValidationError({
                    'password2' : 'The two password fields didn\'t match'}
                )
            
        if User.objects.filter(username=username).exists():
            raise ValidationError({
                    'password2' : 'A user with that username already exists.'}
                )
        
        if len(password1) < 8:
            raise ValidationError({
                    'password2' : 'This password is too short. It must contain at least 8 characters'}
                )
        if data['email']: 
            try:
                validate_email(data['email'])
            except ValidationError:
                raise ValidationError({
                    'email' : 'Enter a valid email address'}
                )
        
        return data



class ProfileForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.CharField(widget=forms.EmailInput, required=False)
    password1 = forms.CharField(widget=forms.PasswordInput, required=False)
    password2 = forms.CharField(widget=forms.PasswordInput, required=False)

    def clean(self):
        data = super().clean()

        if data['password1'] != "":
            if data['password1'] != data['password2']:
                raise ValidationError({
                    'password2' : 'The two password fields didn\'t match'}
                )
            if len(data['password1']) < 8:
                raise ValidationError({
                    'password1' : 'This password is too short. It must contain at least 8 characters'}
                )
        if data['password2'] != "" and data['password1'] == "":
            raise ValidationError({
                    'password2' : 'The two password fields didn\'t match'}
                )

        if data['email'] != "":
            try:
                validate_email(data['email'])
            except ValidationError:
                raise ValidationError({
                    'email' : 'Enter a valid email address'}
                )
        
        return data
    