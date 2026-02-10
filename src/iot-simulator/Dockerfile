FROM python:3.11-slim

WORKDIR /app

# Installer la librairie MQTT
RUN pip install paho-mqtt psycopg2-binary

# Copier le script du capteur dans le conteneur
COPY sensor.py .
COPY subscriber.py .

# Lancer le capteur
CMD ["python", "subscriber.py", "&&", "python", "sensor.py"]
