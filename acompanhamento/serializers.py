# acompanhamento/serializers.py
from rest_framework import serializers
from .models import RegistroDiario, Refeicao, Alimento, ItemRefeicao

class RegistroDiarioSerializer(serializers.ModelSerializer):
    usuario = serializers.ReadOnlyField(source='usuario.username')
    class Meta:
        model = RegistroDiario
        fields = '__all__'

class AlimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimento
        fields = '__all__'

# --- NOVOS SERIALIZERS PARA LEITURA E ESCRITA ---

# Serializer para mostrar o nome do alimento dentro do item
class AlimentoNomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimento
        fields = ['nome']

# Serializer para LER um item de refeição
class ItemRefeicaoReadSerializer(serializers.ModelSerializer):
    # Usamos o serializer acima para mostrar os detalhes do alimento
    alimento = AlimentoSerializer(read_only=True)
    class Meta:
        model = ItemRefeicao
        fields = ['id', 'alimento', 'quantidade']

# Serializer para LER uma refeição completa
class RefeicaoReadSerializer(serializers.ModelSerializer):
    # Mostra os itens aninhados usando o serializer de leitura
    itens = ItemRefeicaoReadSerializer(many=True, source='itemrefeicao_set')
    class Meta:
        model = Refeicao
        fields = ['id', 'registro_diario', 'tipo', 'horario', 'itens']

# Serializer para CRIAR um item de refeição
class ItemRefeicaoWriteSerializer(serializers.ModelSerializer):
    # Para criar, o frontend só precisa mandar o ID do alimento
    alimento_id = serializers.PrimaryKeyRelatedField(
        queryset=Alimento.objects.all(), source='alimento'
    )
    class Meta:
        model = ItemRefeicao
        fields = ['alimento_id', 'quantidade']

# Serializer para CRIAR uma refeição completa
class RefeicaoWriteSerializer(serializers.ModelSerializer):
    # O frontend vai mandar uma lista de itens aqui
    itens = ItemRefeicaoWriteSerializer(many=True)

    class Meta:
        model = Refeicao
        fields = ['tipo', 'horario', 'itens']

    def create(self, validated_data):
        # Tira os dados dos itens de dentro dos dados validados
        itens_data = validated_data.pop('itens')
        # Cria o objeto principal da Refeição
        refeicao = Refeicao.objects.create(**validated_data)
        # Para cada item na lista de itens...
        for item_data in itens_data:
            # ...cria o objeto ItemRefeicao, ligando-o à refeição
            ItemRefeicao.objects.create(refeicao=refeicao, **item_data)
        return refeicao