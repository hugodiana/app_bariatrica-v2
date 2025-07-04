# acompanhamento/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroDiarioViewSet

# Cria um roteador para gerar as URLs da API automaticamente
router = DefaultRouter()
router.register(r'registros', RegistroDiarioViewSet, basename='registrodiario')

urlpatterns = [
    path('', include(router.urls)),
]