# acompanhamento/serializers.py
from rest_framework import serializers
from .models import RegistroDiario

class RegistroDiarioSerializer(serializers.ModelSerializer):
    # Pega o nome do usuário para exibir, em vez de apenas o ID
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = RegistroDiario
        # Lista todos os campos que queremos que a API use
        fields = [
            'id',
            'usuario',
            'data_registro',
            'peso',
            'agua_ml',
            'vitaminas_tomadas',
            'observacoes'
        ]
        # Garante que o usuário não possa editar a data de um registro existente
        read_only_fields = ['data_registro']