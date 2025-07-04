# acompanhamento/admin.py

from django.contrib import admin
from .models import RegistroDiario

# Register your models here.

# Esta linha registra nosso modelo para que ele apareça no admin
admin.site.register(RegistroDiario)