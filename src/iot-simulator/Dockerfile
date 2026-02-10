FROM python:3.11-slim

WORKDIR /app

# Installer la librairie MQTT
RUN pip install paho-mqtt

# Copier le script du capteur dans le conteneur
COPY sensor.py .

# Lancer le capteur
CMD ["python", "sensor.py"]
