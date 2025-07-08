# acompanhamento/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import (
    RegistroDiario, 
    Refeicao, 
    Alimento, 
    Compromisso, 
    EntradaDiario
)
from .serializers import (
    RegistroDiarioSerializer, 
    AlimentoSerializer,
    RefeicaoReadSerializer,
    RefeicaoWriteSerializer,
    CompromissoSerializer,
    EntradaDiarioSerializer
)
from django.utils import timezone

class RegistroDiarioViewSet(viewsets.ModelViewSet):
    serializer_class = RegistroDiarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RegistroDiario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        hoje = timezone.now().date()
        registro, created = RegistroDiario.objects.update_or_create(
            usuario=self.request.user,
            data_registro=hoje,
            defaults=serializer.validated_data
        )

class AlimentoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AlimentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Alimento.objects.all()
        search_term = self.request.query_params.get('search', None)
        if search_term is not None:
            queryset = queryset.filter(nome__icontains=search_term)
        return queryset.order_by('nome')

class RefeicaoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Refeicao.objects.filter(registro_diario__usuario=self.request.user)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return RefeicaoWriteSerializer
        return RefeicaoReadSerializer

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        hoje = timezone.now().date()
        registro_diario, _ = RegistroDiario.objects.get_or_create(
            usuario=self.request.user,
            data_registro=hoje
        )
        refeicao = write_serializer.save(registro_diario=registro_diario)
        read_serializer = RefeicaoReadSerializer(refeicao, context={'request': request})
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CompromissoViewSet(viewsets.ModelViewSet):
    serializer_class = CompromissoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Compromisso.objects.filter(usuario=self.request.user).order_by('data_hora')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

# A CORREÇÃO ESTÁ AQUI: A classe EntradaDiarioViewSet estava faltando
class EntradaDiarioViewSet(viewsets.ModelViewSet):
    serializer_class = EntradaDiarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return EntradaDiario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)