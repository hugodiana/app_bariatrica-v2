# acompanhamento/serializers.py

from rest_framework import serializers
from .models import (
    RegistroDiario, 
    Refeicao, 
    Alimento, 
    ItemRefeicao, 
    Compromisso,
    EntradaDiario
)

class RegistroDiarioSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    class Meta:
        model = RegistroDiario
        fields = '__all__'

class AlimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimento
        fields = '__all__'

class ItemRefeicaoReadSerializer(serializers.ModelSerializer):
    alimento = AlimentoSerializer(read_only=True)
    class Meta:
        model = ItemRefeicao
        fields = ['id', 'alimento', 'quantidade']

class RefeicaoReadSerializer(serializers.ModelSerializer):
    itens = ItemRefeicaoReadSerializer(many=True, source='itemrefeicao_set')
    class Meta:
        model = Refeicao
        fields = ['id', 'registro_diario', 'tipo', 'horario', 'itens']

class ItemRefeicaoWriteSerializer(serializers.ModelSerializer):
    alimento_id = serializers.PrimaryKeyRelatedField(
        queryset=Alimento.objects.all(), source='alimento'
    )
    class Meta:
        model = ItemRefeicao
        fields = ['alimento_id', 'quantidade']

class RefeicaoWriteSerializer(serializers.ModelSerializer):
    itens = ItemRefeicaoWriteSerializer(many=True)
    class Meta:
        model = Refeicao
        fields = ['tipo', 'horario', 'itens']
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        refeicao = Refeicao.objects.create(**validated_data)
        for item_data in itens_data:
            ItemRefeicao.objects.create(refeicao=refeicao, **item_data)
        return refeicao

class CompromissoSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    class Meta:
        model = Compromisso
        fields = ['id', 'usuario', 'titulo', 'data_hora', 'local', 'descricao']

# A CORREÇÃO ESTÁ NA CLASSE ABAIXO, QUE ESTAVA FALTANDO OU INCOMPLETA
class EntradaDiarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntradaDiario
        fields = ['id', 'data', 'texto']
        read_only_fields = ['data']