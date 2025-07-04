# perfis/models.py
from django.db import models
from django.contrib.auth.models import User

class Perfil(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)

    data_cirurgia = models.DateField(null=True, blank=True)
    peso_inicial = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    meta_peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # A correção está aqui, garantindo que o parêntese final (linha 19) exista.
    altura_cm = models.PositiveIntegerField(
        help_text="Altura em centímetros",
        null=True, blank=True
    )

    def __str__(self):
        return f"Perfil de {self.usuario.username}"