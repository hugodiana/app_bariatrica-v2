# acompanhamento/management/commands/load_alimentos.py

from django.core.management.base import BaseCommand
from acompanhamento.models import Alimento
from decimal import Decimal

# LISTA DE ALIMENTOS EMBUTIDA DIRETAMENTE NO CÓDIGO
ALIMENTOS_PARA_CARREGAR = [
    {'nome': 'Arroz, integral, cozido', 'calorias': '124', 'proteinas': '2.6', 'carboidratos': '25.8', 'gorduras': '1.0'},
    {'nome': 'Arroz, tipo 1, cozido', 'calorias': '128', 'proteinas': '2.5', 'carboidratos': '28.1', 'gorduras': '0.2'},
    {'nome': 'Feijão, carioca, cozido', 'calorias': '76', 'proteinas': '5.0', 'carboidratos': '13.6', 'gorduras': '0.5'},
    {'nome': 'Feijão, preto, cozido', 'calorias': '77', 'proteinas': '4.5', 'carboidratos': '14.0', 'gorduras': '0.5'},
    {'nome': 'Lentilha, cozida', 'calorias': '93', 'proteinas': '6.3', 'carboidratos': '16.3', 'gorduras': '0.5'},
    {'nome': 'Carne, bovina, acém, moído, cozido', 'calorias': '217', 'proteinas': '29.0', 'carboidratos': '0', 'gorduras': '10.8'},
    {'nome': 'Carne, bovina, filé mignon, sem gordura, grelhado', 'calorias': '149', 'proteinas': '27.4', 'carboidratos': '0', 'gorduras': '3.9'},
    {'nome': 'Frango, filé, grelhado', 'calorias': '159', 'proteinas': '32.7', 'carboidratos': '0', 'gorduras': '2.5'},
    {'nome': 'Frango, coxa, assada, com pele', 'calorias': '216', 'proteinas': '26.8', 'carboidratos': '0', 'gorduras': '11.6'},
    {'nome': 'Salmão, sem pele, grelhado', 'calorias': '204', 'proteinas': '27.0', 'carboidratos': '0', 'gorduras': '10.2'},
    {'nome': 'Tilápia, filé, assado', 'calorias': '128', 'proteinas': '26.2', 'carboidratos': '0', 'gorduras': '2.7'},
    {'nome': 'Ovo, de galinha, inteiro, cozido', 'calorias': '146', 'proteinas': '13.3', 'carboidratos': '0.6', 'gorduras': '9.5'},
    {'nome': 'Clara de ovo, cozida', 'calorias': '52', 'proteinas': '10.9', 'carboidratos': '0.7', 'gorduras': '0.2'},
    {'nome': 'Abacaxi, pérola, cru', 'calorias': '48', 'proteinas': '0.9', 'carboidratos': '9.0', 'gorduras': '0.1'},
    {'nome': 'Abacate, cru', 'calorias': '96', 'proteinas': '1.2', 'carboidratos': '6.0', 'gorduras': '8.4'},
    {'nome': 'Açaí, polpa, congelada', 'calorias': '58', 'proteinas': '0.8', 'carboidratos': '6.2', 'gorduras': '3.7'},
    {'nome': 'Acerola, crua', 'calorias': '33', 'proteinas': '0.9', 'carboidratos': '8.0', 'gorduras': '0.2'},
    {'nome': 'Banana, prata, crua', 'calorias': '98', 'proteinas': '1.3', 'carboidratos': '26.0', 'gorduras': '0.1'},
    {'nome': 'Laranja, pêra, crua', 'calorias': '37', 'proteinas': '1.0', 'carboidratos': '8.9', 'gorduras': '0.1'},
    {'nome': 'Maçã, fuji, com casca, crua', 'calorias': '56', 'proteinas': '0.3', 'carboidratos': '14.6', 'gorduras': '0'},
    {'nome': 'Mamão, formosa, cru', 'calorias': '45', 'proteinas': '0.8', 'carboidratos': '11.6', 'gorduras': '0.1'},
    {'nome': 'Manga, palmer, crua', 'calorias': '72', 'proteinas': '1.0', 'carboidratos': '19.5', 'gorduras': '0.4'},
    {'nome': 'Melancia, crua', 'calorias': '31', 'proteinas': '0.9', 'carboidratos': '7.2', 'gorduras': '0.2'},
    {'nome': 'Morango, cru', 'calorias': '30', 'proteinas': '0.9', 'carboidratos': '6.8', 'gorduras': '0.3'},
    {'nome': 'Uva, itália, crua', 'calorias': '64', 'proteinas': '0.8', 'carboidratos': '16.7', 'gorduras': '0.2'},
    {'nome': 'Abóbora, menina brasileira, cozida', 'calorias': '29', 'proteinas': '0.7', 'carboidratos': '5.7', 'gorduras': '0.3'},
    {'nome': 'Abobrinha, italiana, cozida', 'calorias': '15', 'proteinas': '1.1', 'carboidratos': '3.0', 'gorduras': '0.2'},
    {'nome': 'Alface, crespa, crua', 'calorias': '11', 'proteinas': '1.3', 'carboidratos': '1.7', 'gorduras': '0.1'},
    {'nome': 'Batata, inglesa, cozida', 'calorias': '52', 'proteinas': '1.2', 'carboidratos': '11.9', 'gorduras': '0'},
    {'nome': 'Batata, doce, cozida', 'calorias': '77', 'proteinas': '0.6', 'carboidratos': '18.4', 'gorduras': '0.1'},
    {'nome': 'Berinjela, cozida', 'calorias': '19', 'proteinas': '0.7', 'carboidratos': '4.4', 'gorduras': '0.1'},
    {'nome': 'Beterraba, cozida', 'calorias': '32', 'proteinas': '1.3', 'carboidratos': '7.2', 'gorduras': '0.1'},
    {'nome': 'Brócolis, cozido', 'calorias': '25', 'proteinas': '2.1', 'carboidratos': '4.4', 'gorduras': '0.5'},
    {'nome': 'Cebola, crua', 'calorias': '39', 'proteinas': '1.7', 'carboidratos': '8.9', 'gorduras': '0.1'},
    {'nome': 'Cenoura, cozida', 'calorias': '34', 'proteinas': '0.8', 'carboidratos': '7.9', 'gorduras': '0.2'},
    {'nome': 'Couve-flor, cozida', 'calorias': '19', 'proteinas': '1.8', 'carboidratos': '3.9', 'gorduras': '0.1'},
    {'nome': 'Espinafre, cozido', 'calorias': '28', 'proteinas': '3.5', 'carboidratos': '3.7', 'gorduras': '0.3'},
    {'nome': 'Mandioca, cozida', 'calorias': '125', 'proteinas': '0.6', 'carboidratos': '30.1', 'gorduras': '0.3'},
    {'nome': 'Pepino, japonês, cru', 'calorias': '10', 'proteinas': '0.7', 'carboidratos': '2.0', 'gorduras': '0.1'},
    {'nome': 'Pimentão, verde, cru', 'calorias': '23', 'proteinas': '1.1', 'carboidratos': '4.9', 'gorduras': '0.2'},
    {'nome': 'Tomate, com semente, cru', 'calorias': '15', 'proteinas': '1.1', 'carboidratos': '3.1', 'gorduras': '0.2'},
    {'nome': 'Leite, de vaca, integral, UHT', 'calorias': '60', 'proteinas': '3.2', 'carboidratos': '4.7', 'gorduras': '3.3'},
    {'nome': 'Leite, de vaca, desnatado, UHT', 'calorias': '36', 'proteinas': '3.4', 'carboidratos': '5.1', 'gorduras': '0.2'},
    {'nome': 'Queijo, minas frescal', 'calorias': '264', 'proteinas': '17.4', 'carboidratos': '1.6', 'gorduras': '20.2'},
    {'nome': 'Queijo, mussarela', 'calorias': '316', 'proteinas': '22.0', 'carboidratos': '1.4', 'gorduras': '24.1'},
    {'nome': 'Queijo, parmesão, ralado', 'calorias': '454', 'proteinas': '35.8', 'carboidratos': '2.2', 'gorduras': '32.1'},
    {'nome': 'Requeijão, cremoso', 'calorias': '257', 'proteinas': '10.3', 'carboidratos': '1.2', 'gorduras': '23.3'},
    {'nome': 'Iogurte, natural, integral', 'calorias': '62', 'proteinas': '3.8', 'carboidratos': '5.2', 'gorduras': '3.0'},
    {'nome': 'Pão, de forma, integral', 'calorias': '251', 'proteinas': '12.0', 'carboidratos': '49.0', 'gorduras': '3.4'},
    {'nome': 'Pão, francês', 'calorias': '289', 'proteinas': '8.0', 'carboidratos': '60.3', 'gorduras': '1.5'},
    {'nome': 'Aveia, flocos, crua', 'calorias': '394', 'proteinas': '13.9', 'carboidratos': '66.6', 'gorduras': '8.5'},
    {'nome': 'Macarrão, trigo, cozido', 'calorias': '111', 'proteinas': '3.8', 'carboidratos': '23.1', 'gorduras': '0.4'},
    {'nome': 'Azeite, de oliva, extra virgem', 'calorias': '884', 'proteinas': '0', 'carboidratos': '0', 'gorduras': '100.0'},
    {'nome': 'Manteiga, com sal', 'calorias': '726', 'proteinas': '0.4', 'carboidratos': '0', 'gorduras': '82.4'},
    {'nome': 'Castanha-do-pará, crua', 'calorias': '643', 'proteinas': '14.5', 'carboidratos': '15.1', 'gorduras': '63.4'},
    {'nome': 'Amendoim, torrado, salgado', 'calorias': '596', 'proteinas': '23.0', 'carboidratos': '19.9', 'gorduras': '50.1'},
]

class Command(BaseCommand):
    help = 'Carrega uma lista de alimentos pré-definida no banco de dados'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Limpando dados antigos de alimentos...'))
        Alimento.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Iniciando importação de alimentos...'))
        
        for alimento_data in ALIMENTOS_PARA_CARREGAR:
            Alimento.objects.create(
                nome=alimento_data['nome'],
                porcao_gramas=100, # Todos os dados são baseados em 100g
                calorias=Decimal(alimento_data['calorias']),
                proteinas=Decimal(alimento_data['proteinas']),
                carboidratos=Decimal(alimento_data['carboidratos']),
                gorduras=Decimal(alimento_data['gorduras'])
            )

        self.stdout.write(self.style.SUCCESS(f'Importação concluída! {len(ALIMENTOS_PARA_CARREGAR)} alimentos adicionados.'))