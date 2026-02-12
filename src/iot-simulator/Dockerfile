FROM python:3.11-slim

# Dossier de travail dans le container
WORKDIR /app

# Installation des dépendances Python
RUN pip install --no-cache-dir \
    paho-mqtt \
    psycopg2-binary \
    python-dotenv

# Copie des fichiers Python
COPY subscriber.py .
COPY sensor1.py .
COPY sensor2.py .
COPY sensor3.py .
COPY sensor4.py .
COPY sensor5.py .
COPY sensor6.py .

# Comportement par défaut : lancer le subscriber
CMD ["python", "subscriber.py"]
