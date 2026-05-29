FROM python:3.10-slim

WORKDIR /app

# Instalar los controladores que pide la guía (unixodbc y odbc-mariadb)
RUN apt-get update && apt-get install -y \
    build-essential \
    unixodbc \
    unixodbc-dev \
    odbc-mariadb \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]