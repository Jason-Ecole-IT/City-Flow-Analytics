FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y mosquitto && \
    rm -rf /var/lib/apt/lists/*

# Copie du fichier de configuration
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf

EXPOSE 1883

CMD ["mosquitto", "-c", "/etc/mosquitto/mosquitto.conf"]
