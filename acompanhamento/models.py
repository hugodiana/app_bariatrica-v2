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
    
    # ADICIONE O NOVO MODELO ABAIXO
class Refeicao(models.Model):
    TIPO_REFEICAO_CHOICES = [
        ('cafe_da_manha', 'Café da Manhã'),
        ('lanche_da_manha', 'Lanche da Manhã'),
        ('almoco', 'Almoço'),
        ('lanche_da_tarde', 'Lanche da Tarde'),
        ('jantar', 'Jantar'),
        ('ceia', 'Ceia'),
        ('outra', 'Outra'),
    ]

    # Vincula a refeição a um registro diário específico
    registro_diario = models.ForeignKey(
        RegistroDiario, 
        on_delete=models.CASCADE, 
        related_name='refeicoes'
    )

    tipo = models.CharField(
        max_length=20,
        choices=TIPO_REFEICAO_CHOICES,
        default='outra'
    )

    descricao = models.TextField(
        max_length=500,
        help_text="Descreva o que você comeu e bebeu."
    )

    horario = models.TimeField()

    def __str__(self):
        # O get_tipo_display() pega o texto legível (ex: "Almoço") em vez do valor ('almoco')
        return f"{self.get_tipo_display()} - {self.registro_diario.data_registro}"