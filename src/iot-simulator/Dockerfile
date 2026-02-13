FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances Python
RUN pip install --no-cache-dir \
    paho-mqtt \
    psycopg2-binary \
    python-dotenv

# Copie des scripts dans l'image
COPY subscriber.py .
COPY sensor.py .

# Comportement par défaut : lancer le subscriber
CMD ["python", "subscriber.py"]
