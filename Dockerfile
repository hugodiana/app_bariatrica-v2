# Usa uma imagem base oficial do Python
FROM python:3.11-slim-buster

# Define variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Cria e define o diretório de trabalho dentro do container
WORKDIR /app

# Instala as dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev

# Copia e instala as dependências do Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia o resto do código do seu projeto para o container
COPY . /app/

# Expõe a porta que o Gunicorn vai usar
EXPOSE 8000

# Comando para iniciar a aplicação quando o container rodar
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "2", "backend.wsgi"]