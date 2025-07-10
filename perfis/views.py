# perfis/views.py

from rest_framework import generics, permissions
from .models import Perfil
from .serializers import PerfilSerializer # Agora a importação funcionará
from dj_rest_auth.registration.views import RegisterView
from rest_framework.permissions import AllowAny

class MeuPerfilDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = Perfil.objects.get_or_create(usuario=self.request.user)
        return obj

class PublicRegisterView(RegisterView):
    permission_classes = (AllowAny,)
    authentication_classes = ()