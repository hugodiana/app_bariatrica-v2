# acompanhamento/views.py
from rest_framework import viewsets, permissions
from .models import RegistroDiario, Refeicao, Alimento, ItemRefeicao
from .serializers import (
    RegistroDiarioSerializer, 
    AlimentoSerializer,
    RefeicaoReadSerializer,  # Serializer de leitura
    RefeicaoWriteSerializer  # Serializer de escrita
)
from django.utils import timezone

# ... (RegistroDiarioViewSet e AlimentoViewSet continuam iguais) ...
class RegistroDiarioViewSet(viewsets.ModelViewSet):
    serializer_class = RegistroDiarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return RegistroDiario.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        hoje = timezone.now().date()
        registro_diario, created = RegistroDiario.objects.get_or_create(usuario=self.request.user, data_registro=hoje)
        serializer.save(usuario=self.request.user, data_registro=hoje)

class AlimentoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AlimentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        queryset = Alimento.objects.all()
        search_term = self.request.query_params.get('search', None)
        if search_term is not None:
            queryset = queryset.filter(nome__icontains=search_term)
        return queryset.order_by('nome')

# --- VIEWSET DE REFEIÇÃO ATUALIZADA ---
class RefeicaoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Refeicao.objects.filter(registro_diario__usuario=self.request.user)

    def get_serializer_class(self):
        # Se a ação for 'create' ou 'update', usa o serializer de escrita
        if self.action in ['create', 'update', 'partial_update']:
            return RefeicaoWriteSerializer
        # Para todas as outras ações ('list', 'retrieve'), usa o de leitura
        return RefeicaoReadSerializer

    def perform_create(self, serializer):
        hoje = timezone.now().date()
        registro_diario, _ = RegistroDiario.objects.get_or_create(
            usuario=self.request.user, 
            data_registro=hoje
        )
        serializer.save(registro_diario=registro_diario)