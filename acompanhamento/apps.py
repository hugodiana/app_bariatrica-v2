from django.apps import AppConfig
from .models import RegistroDiario, Refeicao

class AcompanhamentoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'acompanhamento'

