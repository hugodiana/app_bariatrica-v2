# acompanhamento/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroDiarioViewSet, RefeicaoViewSet

# Cria um roteador para gerar as URLs da API automaticamente
router = DefaultRouter()
router.register(r'registros', RegistroDiarioViewSet, basename='registrodiario')
router.register(r'refeicoes', RefeicaoViewSet, basename='refeicao')
urlpatterns = [
    path('', include(router.urls)),
]