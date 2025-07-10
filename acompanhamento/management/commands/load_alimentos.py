# acompanhamento/management/commands/load_alimentos.py

from django.core.management.base import BaseCommand
from acompanhamento.models import Alimento
from decimal import Decimal

# LISTA DE ALIMENTOS EMBUTIDA DIRETAMENTE NO CÓDIGO (Valores por 100g)
ALIMENTOS_PARA_CARREGAR = [
    {'nome': 'Arroz, integral, cozido', 'calorias': '124', 'proteinas': '2.6', 'carboidratos': '25.8', 'gorduras': '1.0'},
    {'nome': 'Arroz, tipo 1, cozido', 'calorias': '128', 'proteinas': '2.5', 'carboidratos': '28.1', 'gorduras': '0.2'},
    {'nome': 'Feijão, carioca, cozido', 'calorias': '76', 'proteinas': '5.0', 'carboidratos': '13.6', 'gorduras': '0.5'},
    {'nome': 'Feijão, preto, cozido', 'calorias': '77', 'proteinas': '4.5', 'carboidratos': '14.0', 'gorduras': '0.5'},
    {'nome': 'Lentilha, cozida', 'calorias': '93', 'proteinas': '6.3', 'carboidratos': '16.3', 'gorduras': '0.5'},
    {'nome': 'Grão-de-bico, cozido', 'calorias': '136', 'proteinas': '8.4', 'carboidratos': '27.4', 'gorduras': '2.4'},
    {'nome': 'Quinoa, cozida', 'calorias': '120', 'proteinas': '4.4', 'carboidratos': '21.3', 'gorduras': '1.9'},
    {'nome': 'Carne, bovina, patinho, moído, cozido', 'calorias': '185', 'proteinas': '27.0', 'carboidratos': '0', 'gorduras': '8.0'},
    {'nome': 'Carne, bovina, filé mignon, sem gordura, grelhado', 'calorias': '149', 'proteinas': '27.4', 'carboidratos': '0', 'gorduras': '3.9'},
    {'nome': 'Frango, filé de peito, grelhado', 'calorias': '165', 'proteinas': '31.0', 'carboidratos': '0', 'gorduras': '3.6'},
    {'nome': 'Frango, coxa, assada, com pele', 'calorias': '216', 'proteinas': '26.8', 'carboidratos': '0', 'gorduras': '11.6'},
    {'nome': 'Salmão, sem pele, grelhado', 'calorias': '208', 'proteinas': '20.4', 'carboidratos': '0', 'gorduras': '13.4'},
    {'nome': 'Tilápia, filé, assado', 'calorias': '128', 'proteinas': '26.2', 'carboidratos': '0', 'gorduras': '2.7'},
    {'nome': 'Atum, em óleo, drenado', 'calorias': '198', 'proteinas': '29.1', 'carboidratos': '0', 'gorduras': '8.2'},
    {'nome': 'Atum, em água, drenado', 'calorias': '116', 'proteinas': '25.5', 'carboidratos': '0', 'gorduras': '0.8'},
    {'nome': 'Ovo, de galinha, inteiro, cozido', 'calorias': '155', 'proteinas': '12.6', 'carboidratos': '1.1', 'gorduras': '10.6'},
    {'nome': 'Clara de ovo, cozida', 'calorias': '52', 'proteinas': '10.9', 'carboidratos': '0.7', 'gorduras': '0.2'},
    {'nome': 'Abacate, cru', 'calorias': '160', 'proteinas': '2.0', 'carboidratos': '8.5', 'gorduras': '14.7'},
    {'nome': 'Açaí, polpa, congelada, sem açúcar', 'calorias': '58', 'proteinas': '0.8', 'carboidratos': '6.2', 'gorduras': '3.7'},
    {'nome': 'Acerola, crua', 'calorias': '32', 'proteinas': '0.4', 'carboidratos': '7.7', 'gorduras': '0.3'},
    {'nome': 'Banana, prata, crua', 'calorias': '98', 'proteinas': '1.3', 'carboidratos': '26.0', 'gorduras': '0.1'},
    {'nome': 'Laranja, pêra, crua', 'calorias': '47', 'proteinas': '0.9', 'carboidratos': '12.4', 'gorduras': '0.1'},
    {'nome': 'Maçã, fuji, com casca, crua', 'calorias': '52', 'proteinas': '0.3', 'carboidratos': '13.8', 'gorduras': '0.2'},
    {'nome': 'Mamão, formosa, cru', 'calorias': '45', 'proteinas': '0.8', 'carboidratos': '11.6', 'gorduras': '0.1'},
    {'nome': 'Manga, palmer, crua', 'calorias': '60', 'proteinas': '0.8', 'carboidratos': '15.0', 'gorduras': '0.4'},
    {'nome': 'Melancia, crua', 'calorias': '30', 'proteinas': '0.6', 'carboidratos': '7.6', 'gorduras': '0.2'},
    {'nome': 'Melão, amarelo, cru', 'calorias': '29', 'proteinas': '0.9', 'carboidratos': '6.6', 'gorduras': '0.1'},
    {'nome': 'Morango, cru', 'calorias': '32', 'proteinas': '0.7', 'carboidratos': '7.7', 'gorduras': '0.3'},
    {'nome': 'Uva, itália, crua', 'calorias': '69', 'proteinas': '0.7', 'carboidratos': '18.1', 'gorduras': '0.2'},
    {'nome': 'Pêra, williams, crua', 'calorias': '53', 'proteinas': '0.5', 'carboidratos': '13.9', 'gorduras': '0.1'},
    {'nome': 'Abóbora, moranga, cozida', 'calorias': '24', 'proteinas': '1.0', 'carboidratos': '4.8', 'gorduras': '0.1'},
    {'nome': 'Abobrinha, italiana, cozida', 'calorias': '15', 'proteinas': '1.1', 'carboidratos': '3.0', 'gorduras': '0.2'},
    {'nome': 'Aipim (mandioca), cozido', 'calorias': '125', 'proteinas': '0.6', 'carboidratos': '30.1', 'gorduras': '0.3'},
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
    {'nome': 'Pepino, japonês, cru', 'calorias': '10', 'proteinas': '0.7', 'carboidratos': '2.0', 'gorduras': '0.1'},
    {'nome': 'Pimentão, verde, cru', 'calorias': '23', 'proteinas': '1.1', 'carboidratos': '4.9', 'gorduras': '0.2'},
    {'nome': 'Tomate, com semente, cru', 'calorias': '15', 'proteinas': '1.1', 'carboidratos': '3.1', 'gorduras': '0.2'},
    {'nome': 'Vagem, cozida', 'calorias': '25', 'proteinas': '1.5', 'carboidratos': '5.3', 'gorduras': '0.2'},
    {'nome': 'Leite, de vaca, integral, UHT', 'calorias': '60', 'proteinas': '3.2', 'carboidratos': '4.7', 'gorduras': '3.3'},
    {'nome': 'Leite, de vaca, desnatado, UHT', 'calorias': '36', 'proteinas': '3.4', 'carboidratos': '5.1', 'gorduras': '0.2'},
    {'nome': 'Queijo, minas frescal', 'calorias': '264', 'proteinas': '17.4', 'carboidratos': '1.6', 'gorduras': '20.2'},
    {'nome': 'Queijo, mussarela', 'calorias': '316', 'proteinas': '22.0', 'carboidratos': '1.4', 'gorduras': '24.1'},
    {'nome': 'Queijo, parmesão, ralado', 'calorias': '454', 'proteinas': '35.8', 'carboidratos': '2.2', 'gorduras': '32.1'},
    {'nome': 'Requeijão, cremoso', 'calorias': '257', 'proteinas': '10.3', 'carboidratos': '1.2', 'gorduras': '23.3'},
    {'nome': 'Iogurte, natural, integral', 'calorias': '62', 'proteinas': '3.8', 'carboidratos': '5.2', 'gorduras': '3.0'},
    {'nome': 'Pão, de forma, integral', 'calorias': '251', 'proteinas': '12.0', 'carboidratos': '49.0', 'gorduras': '3.4'},
    {'nome': 'Pão, francês', 'calorias': '289', 'proteinas': '8.0', 'carboidratos': '60.3', 'gorduras': '1.5'},
    {'nome': 'Tapioca (goma de mandioca)', 'calorias': '240', 'proteinas': '0', 'carboidratos': '60.0', 'gorduras': '0'},
    {'nome': 'Aveia, flocos, crua', 'calorias': '394', 'proteinas': '13.9', 'carboidratos': '66.6', 'gorduras': '8.5'},
    {'nome': 'Macarrão, trigo, cozido', 'calorias': '111', 'proteinas': '3.8', 'carboidratos': '23.1', 'gorduras': '0.4'},
    {'nome': 'Azeite, de oliva, extra virgem', 'calorias': '884', 'proteinas': '0', 'carboidratos': '0', 'gorduras': '100.0'},
    {'nome': 'Manteiga, com sal', 'calorias': '726', 'proteinas': '0.4', 'carboidratos': '0', 'gorduras': '82.4'},
    {'nome': 'Óleo de Soja', 'calorias': '884', 'proteinas': '0', 'carboidratos': '0', 'gorduras': '100.0'},
    {'nome': 'Castanha-do-pará, crua', 'calorias': '643', 'proteinas': '14.5', 'carboidratos': '15.1', 'gorduras': '63.4'},
    {'nome': 'Amendoim, torrado, salgado', 'calorias': '596', 'proteinas': '23.0', 'carboidratos': '19.9', 'gorduras': '50.1'},
    {'nome': 'Chocolate, ao leite', 'calorias': '536', 'proteinas': '7.0', 'carboidratos': '60.8', 'gorduras': '30.1'},
    {'nome': 'Açúcar, cristal', 'calorias': '387', 'proteinas': '0', 'carboidratos': '99.9', 'gorduras': '0'},
    {'nome': 'Café, infusão, 10%', 'calorias': '4', 'proteinas': '0.3', 'carboidratos': '0.6', 'gorduras': '0'},
    {'nome': 'Whey Protein Concentrado (Exemplo)', 'marca': 'Growth', 'calorias': '380', 'proteinas': '80.0', 'carboidratos': '5.0', 'gorduras': '5.0'},
    {'nome': 'Whey Protein Isolado (Exemplo)', 'marca': 'Max Titanium', 'calorias': '360', 'proteinas': '86.0', 'carboidratos': '2.0', 'gorduras': '1.0'},
]

class Command(BaseCommand):
    help = 'Carrega uma lista de alimentos pré-definida no banco de dados'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Limpando dados antigos de alimentos...'))
        Alimento.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Iniciando importação da lista de alimentos...'))
        
        for alimento_data in ALIMENTOS_PARA_CARREGAR:
            Alimento.objects.create(
                nome=alimento_data.get('nome'),
                marca=alimento_data.get('marca'),
                porcao_gramas=100,
                calorias=Decimal(alimento_data.get('calorias', 0)),
                proteinas=Decimal(alimento_data.get('proteinas', 0)),
                carboidratos=Decimal(alimento_data.get('carboidratos', 0)),
                gorduras=Decimal(alimento_data.get('gorduras', 0))
            )

        self.stdout.write(self.style.SUCCESS(f'Importação concluída! {len(ALIMENTOS_PARA_CARREGAR)} alimentos foram adicionados.'))