# perfis/views.py

from rest_framework import generics, permissions
from .models import Perfil
from .serializers import PerfilSerializer, CustomRegisterSerializer # Importe o CustomRegisterSerializer
from dj_rest_auth.registration.views import RegisterView
from rest_framework.permissions import AllowAny

class MeuPerfilDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = Perfil.objects.get_or_create(usuario=self.request.user)
        return obj

# A CORREÇÃO PRINCIPAL ESTÁ AQUI
class PublicRegisterView(RegisterView):
    # Dizemos explicitamente qual serializer esta view DEVE usar.
    serializer_class = CustomRegisterSerializer

    permission_classes = (AllowAny,)
    authentication_classes = ()