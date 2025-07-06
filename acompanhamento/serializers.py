# acompanhamento/serializers.py

from rest_framework import serializers
from .models import RegistroDiario, Refeicao

class RegistroDiarioSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = RegistroDiario
        fields = [
            'id',
            'usuario',
            'data_registro',
            'peso',
            'agua_ml',
            'vitaminas_tomadas',
            'observacoes'
        ]
        read_only_fields = ['data_registro']


# A correção está na indentação da class Meta abaixo
class RefeicaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refeicao
        fields = ['id', 'registro_diario', 'tipo', 'descricao', 'horario']