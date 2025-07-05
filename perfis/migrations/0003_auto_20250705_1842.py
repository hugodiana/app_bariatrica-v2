# Dentro do seu novo arquivo de migração (ex: perfis/migrations/0002_auto....py)

from django.db import migrations

def create_superuser(apps, schema_editor):
    # Usamos o get_model para pegar o modelo de User
    User = apps.get_model('auth', 'User')

    # Verificamos se o usuário 'admin' já não existe
    if not User.objects.filter(username='admin').exists():
        # Cria o superusuário
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='Ah240911**'  # IMPORTANTE: Escolha uma senha temporária aqui
        )
        print("Superusuário 'admin' criado com sucesso.")

class Migration(migrations.Migration):

    # Esta linha aponta para a última migração do app 'perfis'
    # Se sua última migração não era a 0001, ajuste aqui.
    dependencies = [
        ('perfis', '0001_initial'),
    ]

    operations = [
        # Roda a nossa função Python durante o processo de migração
        migrations.RunPython(create_superuser),
    ]