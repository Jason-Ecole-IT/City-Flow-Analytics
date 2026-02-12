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
COPY sensor7.py .
COPY sensor8.py .
COPY sensor9.py .
COPY sensor10.py .
COPY sensor11.py .
COPY sensor12.py .
COPY sensor13.py .
COPY sensor14.py .
COPY sensor15.py .
COPY sensor16.py .
COPY sensor17.py .
COPY sensor18.py .
COPY sensor19.py .

# Comportement par défaut : lancer le subscriber
CMD ["python", "subscriber.py"]
