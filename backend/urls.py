# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from perfis.views import PublicRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', PublicRegisterView.as_view(), name='rest_register'),
    path('api/acompanhamento/', include('acompanhamento.urls')),
    
    # Esta linha carrega a rota de 'meu-perfil/' de dentro do app perfis
    path('api/', include('perfis.urls')),
    
    path(
        'password-reset/confirm/<uidb64>/<token>/',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'
    ),
]