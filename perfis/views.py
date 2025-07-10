# perfis/views.py
from rest_framework import generics, permissions
from .models import Perfil
from .serializers import PerfilSerializer
from dj_rest_auth.registration.views import RegisterView
from rest_framework.permissions import AllowAny

class PerfilListCreate(generics.ListCreateAPIView):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer

class MeuPerfilDetailView(generics.RetrieveUpdateAPIView):
    """
    Endpoint que retorna os detalhes do perfil do usuário atualmente autenticado.
    """
    serializer_class = PerfilSerializer
    # A permissão IsAuthenticated garante que apenas usuários logados podem acessar esta view.
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # O 'get_object' é sobreescrito para retornar o perfil
        # associado ao 'request.user', que é o usuário fazendo a requisição.
        # Usamos Perfil.objects.get_or_create para criar um perfil caso o usuário
        # seja novo e ainda não tenha um.
        obj, created = Perfil.objects.get_or_create(usuario=self.request.user)
        return obj
    
class PublicRegisterView(RegisterView):
    # Permite acesso a qualquer um (mesmo não logado)
    permission_classes = (AllowAny,)
    # O mais importante: não tenta fazer nenhuma autenticação
    authentication_classes = ()