# perfis/urls.py
from django.urls import path
from .views import PerfilListCreate, MeuPerfilDetailView

urlpatterns = [
    path('meu-perfil/', MeuPerfilDetailView.as_view(), name='meu-perfil'),
]