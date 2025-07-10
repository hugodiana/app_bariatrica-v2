# perfis/serializers.py

from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

class CustomRegisterSerializer(RegisterSerializer):
    # Adicionamos os campos que queremos pedir a mais no registro
    first_name = serializers.CharField(required=True, max_length=30)
    last_name = serializers.CharField(required=True, max_length=30)

    def get_cleaned_data(self):
        # Pega os dados limpos do serializer original (email, senhas)
        data = super().get_cleaned_data()
        # Adiciona nossos novos campos
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
        })
        return data

    def save(self, request):
        # Salva o usuário usando o método original
        user = super().save(request)
        # Define o nome e sobrenome do usuário
        user.first_name = self.cleaned_data.get('first_name')
        user.last_name = self.cleaned_data.get('last_name')
        user.save()
        return user