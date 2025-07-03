# perfis/models.py

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Perfil(models.Model):
    # Esta linha cria uma relação "um-para-um" com o sistema de usuários do Django.
    # Cada usuário terá um perfil, e cada perfil pertence a um único usuário.
    # on_delete=models.CASCADE significa que se um usuário for deletado, seu perfil também será.
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)

    # Aqui adicionamos os campos específicos da nossa aplicação.
    data_cirurgia = models.DateField(null=True, blank=True)
    peso_inicial = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    meta_peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    def __str__(self):
        # Isso define o texto que aparecerá quando nos referirmos a um objeto Perfil.
        return f"Perfil de {self.usuario.username}"