# perfis/urls.py

from django.urls import path
from .views import MeuPerfilDetailView

urlpatterns = [
    # A única URL que este app gerencia é a do perfil do usuário logado
    path('meu-perfil/', MeuPerfilDetailView.as_view(), name='meu-perfil'),
]