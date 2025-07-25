# Generated by Django 5.2.4 on 2025-07-06 00:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acompanhamento', '0003_alimento'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='registrodiario',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='refeicao',
            name='descricao',
        ),
        migrations.AlterField(
            model_name='alimento',
            name='calorias',
            field=models.DecimalField(decimal_places=2, max_digits=7),
        ),
        migrations.AlterField(
            model_name='alimento',
            name='carboidratos',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
        migrations.AlterField(
            model_name='alimento',
            name='gorduras',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
        migrations.AlterField(
            model_name='alimento',
            name='marca',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='alimento',
            name='porcao_gramas',
            field=models.PositiveIntegerField(default=100),
        ),
        migrations.AlterField(
            model_name='alimento',
            name='proteinas',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=7),
        ),
        migrations.AlterField(
            model_name='refeicao',
            name='tipo',
            field=models.CharField(choices=[('cafe_da_manha', 'Café da Manhã'), ('lanche_da_manha', 'Lanche da Manhã'), ('almoco', 'Almoço'), ('lanche_da_tarde', 'Lanche da Tarde'), ('jantar', 'Jantar'), ('ceia', 'Ceia'), ('outra', 'Outra')], max_length=20),
        ),
        migrations.AlterField(
            model_name='registrodiario',
            name='agua_ml',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='registrodiario',
            name='data_registro',
            field=models.DateField(unique_for_date='usuario'),
        ),
        migrations.AlterField(
            model_name='registrodiario',
            name='observacoes',
            field=models.TextField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='registrodiario',
            name='peso',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='registrodiario',
            name='vitaminas_tomadas',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='ItemRefeicao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade', models.DecimalField(decimal_places=2, help_text='Quantidade em gramas ou unidades', max_digits=7)),
                ('alimento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='acompanhamento.alimento')),
                ('refeicao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='acompanhamento.refeicao')),
            ],
        ),
        migrations.AddField(
            model_name='refeicao',
            name='alimentos',
            field=models.ManyToManyField(through='acompanhamento.ItemRefeicao', to='acompanhamento.alimento'),
        ),
    ]
