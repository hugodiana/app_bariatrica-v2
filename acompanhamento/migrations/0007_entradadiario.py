# Generated by Django 5.2.4 on 2025-07-08 13:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('acompanhamento', '0006_compromisso'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EntradaDiario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(auto_now_add=True)),
                ('texto', models.TextField(verbose_name='Texto do Diário')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entradas_diario', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Entrada de Diário',
                'verbose_name_plural': 'Entradas de Diário',
                'ordering': ['-data'],
            },
        ),
    ]
