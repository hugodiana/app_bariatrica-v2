# backend/settings.py

from pathlib import Path
import os
import dj_database_url # Importe no topo

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# LEIA A SECRET_KEY DO AMBIENTE DO SERVIDOR
# Em desenvolvimento, ele usará uma chave insegura qualquer.
SECRET_KEY = os.environ.get(
    'SECRET_KEY', 
    'django-insecure-fallback-key-for-development'
)

# O DEBUG SERÁ 'False' EM PRODUÇÃO
# A variável 'RENDER' será definida automaticamente pelo servidor da Render.
DEBUG = 'RENDER' not in os.environ

# ADICIONE O HOST DO SEU FUTURO SITE DE PRODUÇÃO
ALLOWED_HOSTS = []

RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    # Whitenoise para arquivos estáticos
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'perfis',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'dj_rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth.registration',
    'acompanhamento',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # Configuração do Whitenoise
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ... (ROOT_URLCONF, TEMPLATES continuam iguais)

# ...

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# Esta lógica usa o banco de dados PostgreSQL da Render em produção
# e o nosso db.sqlite3 em desenvolvimento.
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600
    )
}

# ... (AUTH_PASSWORD_VALIDATORS, LANGUAGE_CODE, TIME_ZONE, USE_I18N, USE_TZ continuam iguais)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Esta linha diz ao Django para colocar os arquivos estáticos coletados na pasta 'staticfiles'
STATIC_ROOT = BASE_DIR / "staticfiles"

# Habilita o armazenamento de arquivos estáticos do Whitenoise
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- NOSSAS CONFIGURAÇÕES ---

# CorsHeaders - Permitir que o Vercel (onde nosso frontend estará) acesse a API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
# Em produção, vamos adicionar a URL do Vercel aqui através de variáveis de ambiente

SITE_ID = 1

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

AUTHENTICATION_BACKENDS = (
    'allauth.account.auth_backends.AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
)

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'optional'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'