# acompanhamento/admin.py
from django.contrib import admin
from .models import RegistroDiario, Refeicao, Alimento, ItemRefeicao

# Classe para permitir adicionar Itens de Refeição dentro da página de Refeição
class ItemRefeicaoInline(admin.TabularInline):
    model = ItemRefeicao
    extra = 1 # Quantos campos vazios para adicionar de uma vez

class RefeicaoAdmin(admin.ModelAdmin):
    inlines = [ItemRefeicaoInline]
    list_display = ('__str__', 'registro_diario')

admin.site.register(RegistroDiario)
admin.site.register(Refeicao, RefeicaoAdmin) # Usa a nova configuração para Refeicao
admin.site.register(Alimento)
admin.site.register(ItemRefeicao)