import os
import time
import json
import random

import paho.mqtt.client as mqtt

# -------------------------------------------------------------------
# Configuration "en dur" avec override possible par env
# -------------------------------------------------------------------
MQTT_BROKER = os.getenv("MQTT_BROKER", "mosquitto")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))

DEVICE_ID = os.getenv("DEVICE_ID", "pi_docker_01")
SENSOR_TYPE = os.getenv("SENSOR_TYPE", "temperature")
INTERVAL = int(os.getenv("INTERVAL", "2"))  # secondes

# -------------------------------------------------------------------
# Connexion MQTT
# -------------------------------------------------------------------
client = mqtt.Client(client_id=DEVICE_ID)
client.connect(MQTT_BROKER, MQTT_PORT, 60)

print(
    f"[SENSOR] Connected to MQTT broker {MQTT_BROKER}:{MQTT_PORT} "
    f"as {DEVICE_ID}, sensor={SENSOR_TYPE}, interval={INTERVAL}s"
)

# -------------------------------------------------------------------
# Boucle principale
# -------------------------------------------------------------------
while True:
    if SENSOR_TYPE == "temperature":
        value = round(random.uniform(18.0, 30.0), 2)
        unit = "°C"
    elif SENSOR_TYPE == "humidity":
        value = round(random.uniform(30.0, 90.0), 2)
        unit = "%"
    else:
        value = round(random.uniform(0.0, 100.0), 2)
        unit = "units"

    payload = {
        "device_id": DEVICE_ID,
        "sensor": SENSOR_TYPE,
        "value": value,
        "unit": unit,
        "timestamp": int(time.time()),
    }

    topic = f"iot/{DEVICE_ID}/{SENSOR_TYPE}"
    client.publish(topic, json.dumps(payload))
    print(f"[SENSOR] {topic} -> {payload}", flush=True)

    time.sleep(INTERVAL)
