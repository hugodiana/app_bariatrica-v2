# perfis/serializers.py
from rest_framework import serializers
from .models import Perfil
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class PerfilSerializer(serializers.ModelSerializer):
    # Usamos o UserSerializer para mostrar os dados do usuário de forma aninhada
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = Perfil
        # fields = '__all__' # Mostra todos os campos
        fields = ['id', 'usuario', 'data_cirurgia', 'peso_inicial', 'meta_peso', 'altura_cm']