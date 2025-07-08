# acompanhamento/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegistroDiarioViewSet, 
    RefeicaoViewSet, 
    AlimentoViewSet, 
    CompromissoViewSet,
    EntradaDiarioViewSet # Importe a nova viewset
)

router = DefaultRouter()
router.register(r'registros', RegistroDiarioViewSet, basename='registrodiario')
router.register(r'refeicoes', RefeicaoViewSet, basename='refeicao')
router.register(r'alimentos', AlimentoViewSet, basename='alimento')
router.register(r'compromissos', CompromissoViewSet, basename='compromisso')

# A CORREÇÃO ESTÁ AQUI: Registrando a rota para o diário
router.register(r'entradas-diario', EntradaDiarioViewSet, basename='entradadiario')

urlpatterns = [
    path('', include(router.urls)),
]