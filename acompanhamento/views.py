# acompanhamento/views.py
from rest_framework import viewsets, permissions
from .models import RegistroDiario
from .serializers import RegistroDiarioSerializer
from django.utils import timezone

class RegistroDiarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite aos usuários ver e editar seus
    próprios registros diários.
    """
    serializer_class = RegistroDiarioSerializer
    # Garante que só usuários logados podem acessar esta API
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
        # Verifica se já existe um registro para hoje
        hoje = timezone.now().date()
        if RegistroDiario.objects.filter(usuario=self.request.user, data_registro=hoje).exists():
            # Idealmente, aqui você retornaria um erro claro para a API,
            # mas por enquanto vamos apenas impedir a criação.
            # O serializer cuidará da validação unique_together.
            return

        serializer.save(usuario=self.request.user, data_registro=hoje)