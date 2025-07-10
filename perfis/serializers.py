# perfis/serializers.py

from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Perfil

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PerfilSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    class Meta:
        model = Perfil
        fields = ['id', 'usuario', 'data_cirurgia', 'peso_inicial', 'meta_peso', 'altura_cm']

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True, max_length=30)
    last_name = serializers.CharField(required=True, max_length=30)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
        })
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name')
        user.last_name = self.cleaned_data.get('last_name')
        user.save()
        return user