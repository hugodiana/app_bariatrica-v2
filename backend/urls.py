# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/acompanhamento/', include('acompanhamento.urls')),
    path('api/', include('perfis.urls')),
    
    # URL Fantasma CORRIGIDA
    path(
        'password-reset/confirm/<uidb64>/<token>/',
        TemplateView.as_view(template_name="password_reset_confirm.html"),
        name='password_reset_confirm'
    ),
]