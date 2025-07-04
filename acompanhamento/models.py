# acompanhamento/models.py
from django.db import models
from django.conf import settings

class RegistroDiario(models.Model):
    # Vincula este registro a um usuário. Se o usuário for deletado,
    # todos os seus registros também serão.
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='registros_diarios'
    )

    # A data do registro. unique_for_date garante que só pode haver
    # um registro por usuário por dia.
    data_registro = models.DateField()

    # Campos para o acompanhamento
    peso = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Peso em kg (ex: 85.5)",
        null=True, blank=True
    )
    agua_ml = models.PositiveIntegerField(
        help_text="Quantidade de água consumida em ml",
        null=True, blank=True
    )
    vitaminas_tomadas = models.BooleanField(
        default=False,
        help_text="Marque se tomou as vitaminas"
    )
    observacoes = models.TextField(
        max_length=500,
        help_text="Anote como se sentiu, o que comeu, etc.",
        blank=True
    )

    class Meta:
        # Garante que um usuário não pode ter dois registros para o mesmo dia
        unique_together = ('usuario', 'data_registro')
        # Ordena os registros pela data mais recente primeiro
        ordering = ['-data_registro']

    def __str__(self):
        return f"Registro de {self.usuario.username} - {self.data_registro.strftime('%d/%m/%Y')}"