# acompanhamento/models.py
from django.db import models
from django.conf import settings

class RegistroDiario(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='registros_diarios'
    )
    data_registro = models.DateField()
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    agua_ml = models.PositiveIntegerField(null=True, blank=True)
    vitaminas_tomadas = models.BooleanField(default=False)
    observacoes = models.TextField(max_length=500, blank=True)
    
    class Meta:
        unique_together = ('usuario', 'data_registro')
        ordering = ['-data_registro']

    def __str__(self):
        return f"Registro de {self.usuario.username} - {self.data_registro.strftime('%d/%m/%Y')}"

class Alimento(models.Model):
    nome = models.CharField(max_length=100, help_text="Nome do alimento, ex: Maçã Fuji")
    marca = models.CharField(max_length=100, blank=True, null=True)
    porcao_gramas = models.PositiveIntegerField(default=100)
    calorias = models.DecimalField(max_digits=7, decimal_places=2)
    proteinas = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    carboidratos = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    gorduras = models.DecimalField(max_digits=7, decimal_places=2, default=0)

    def __str__(self):
        if self.marca:
            return f"{self.nome} ({self.marca})"
        return self.nome

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
    registro_diario = models.ForeignKey(RegistroDiario, on_delete=models.CASCADE, related_name='refeicoes')
    tipo = models.CharField(max_length=20, choices=TIPO_REFEICAO_CHOICES)
    horario = models.TimeField()
    alimentos = models.ManyToManyField(Alimento, through='ItemRefeicao')

    def __str__(self):
        # A CORREÇÃO ESTÁ AQUI
        return f"{self.get_tipo_display()} - {self.registro_diario.data_registro.strftime('%d/%m/%Y')}"

class ItemRefeicao(models.Model):
    refeicao = models.ForeignKey(Refeicao, on_delete=models.CASCADE)
    alimento = models.ForeignKey(Alimento, on_delete=models.CASCADE)
    quantidade = models.DecimalField(max_digits=7, decimal_places=2, help_text="Quantidade em gramas ou unidades")

    def __str__(self):
        return f"{self.quantidade}g/un de {self.alimento.nome} em {self.refeicao.get_tipo_display()}"