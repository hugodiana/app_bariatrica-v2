# backend/settings.py

from pathlib import Path
import os
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# --- CONFIGURAÇÕES DE PRODUÇÃO E SEGURANÇA ---

# A Chave Secreta é lida da variável de ambiente em produção
# Em desenvolvimento, usa uma chave insegura como fallback.
SECRET_KEY = os.environ.get(
    'SECRET_KEY', 
    'django-insecure-fallback-key-for-development-do-not-use-in-production'
)

# O modo DEBUG será False em produção e True em desenvolvimento.
# A Render define a variável de ambiente 'RENDER' automaticamente.
DEBUG = 'RENDER' not in os.environ

# Hosts permitidos
ALLOWED_HOSTS = []

# A Render também define esta variável com a URL do seu site.
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
    # Whitenoise para servir arquivos estáticos em produção
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    
    # Nossos apps
    'perfis',
    'acompanhamento',

    # Apps de terceiros
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'dj_rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth.registration',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # Middleware do Whitenoise (deve vir logo após o SecurityMiddleware)
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], # Para a nossa URL fantasma de password reset
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# --- BANCO DE DADOS ---
# Lógica para usar PostgreSQL na Render e SQLite localmente
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600
    )
}


# --- VALIDAÇÃO DE SENHA E INTERNACIONALIZAÇÃO ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# --- ARQUIVOS ESTÁTICOS (PARA O ADMIN DO DJANGO) ---
STATIC_URL = 'static/'
# Onde o 'collectstatic' vai juntar todos os arquivos estáticos
STATIC_ROOT = BASE_DIR / "staticfiles"
# Configuração do Whitenoise para otimizar os arquivos
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# --- CONFIGURAÇÕES PADRÃO E NOSSAS CONFIGURAÇÕES ESPECÍFICAS ---
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    # Quando tivermos a URL do frontend na Vercel, vamos adicioná-la aqui
    # através de uma variável de ambiente.
]

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