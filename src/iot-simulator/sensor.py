import os
import time
import json
import random

import paho.mqtt.client as mqtt

BROKER = os.getenv("MQTT_BROKER", "host.docker.internal")
PORT = int(os.getenv("MQTT_PORT", "1883"))
DEVICE_ID = os.getenv("DEVICE_ID", "pi_docker_01")
SENSOR_TYPE = os.getenv("SENSOR_TYPE", "temperature")
INTERVAL = int(os.getenv("INTERVAL", "2"))

client = mqtt.Client(client_id=DEVICE_ID)
client.connect(BROKER, PORT, 60)

print(f"Connected to MQTT broker {BROKER}:{PORT} as {DEVICE_ID}")

while True:
    if SENSOR_TYPE == "temperature":
        value = round(random.uniform(18, 30), 2)
        unit = "C"
    elif SENSOR_TYPE == "humidity":
        value = round(random.uniform(30, 80), 2)
        unit = "%"
    else:
        value = random.random()
        unit = "?"

    payload = {
        "device_id": DEVICE_ID,
        "sensor": SENSOR_TYPE,
        "value": value,
        "unit": unit,
        "timestamp": int(time.time())
    }

    topic = f"iot/{DEVICE_ID}/{SENSOR_TYPE}"
    client.publish(topic, json.dumps(payload))
    print(f"Published on {topic}: {payload}")

    time.sleep(INTERVAL)
