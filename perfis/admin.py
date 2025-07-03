# perfis/admin.py

from django.contrib import admin
from .models import Perfil # Importa o nosso model Perfil

# Register your models here.

# Esta linha registra o model Perfil na interface de administração
admin.site.register(Perfil)