# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from perfis.views import PublicRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', PublicRegisterView.as_view(), name='rest_register'),
    
    # Verifique se esta linha existe e está correta
    path('api/acompanhamento/', include('acompanhamento.urls')),
    
    path('api/', include('perfis.urls')), # Esta linha é para o 'meu-perfil'
    
    path(
        'password-reset/confirm/<uidb64>/<token>/',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'
    ),
]