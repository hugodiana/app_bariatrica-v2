# acompanhamento/views.py

from rest_framework import viewsets, permissions
from .models import RegistroDiario, Refeicao
from .serializers import RegistroDiarioSerializer, RefeicaoSerializer
from django.utils import timezone

class RegistroDiarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite aos usuários ver e editar seus
    próprios registros diários.
    """
    serializer_class = RegistroDiarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Esta view deve retornar uma lista de todos os registros
        apenas para o usuário logado atualmente.
        """
        return RegistroDiario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Associa o novo registro ao usuário que fez a requisição.
        """
        hoje = timezone.now().date()
        # Usamos get_or_create para evitar erro se já existir um registro hoje
        # A validação final será feita pelo unique_together no modelo.
        registro_diario, created = RegistroDiario.objects.get_or_create(
            usuario=self.request.user, 
            data_registro=hoje
        )
        serializer.save(usuario=self.request.user, data_registro=hoje)

# O erro estava na indentação da classe abaixo
class RefeicaoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite aos usuários ver e editar suas refeições.
    """
    serializer_class = RefeicaoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Esta view deve retornar uma lista de todas as refeições
        para o usuário logado atualmente.
        """
        return Refeicao.objects.filter(registro_diario__usuario=self.request.user)

    def perform_create(self, serializer):
        """
        Ao criar uma nova refeição, busca ou cria o registro diário
        para hoje e associa a refeição a ele.
        """
        hoje = timezone.now().date()
        registro_diario, created = RegistroDiario.objects.get_or_create(
            usuario=self.request.user, 
            data_registro=hoje
        )
        serializer.save(registro_diario=registro_diario)