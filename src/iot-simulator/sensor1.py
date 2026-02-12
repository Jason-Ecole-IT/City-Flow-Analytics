import os
import time
import json
import random
import paho.mqtt.client as mqtt

MQTT_BROKER = os.getenv("MQTT_BROKER", "mosquitto")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))

DEVICE_ID = "road_01"
SENSOR_TYPE = "occupancy"

INTERVAL = 15
BASE_OCCUPANCY = 50
MAX_VARIANCE = 10

client = mqtt.Client(client_id=DEVICE_ID)
client.connect(MQTT_BROKER, MQTT_PORT, 60)

print(f"[SENSOR1] Connected to {MQTT_BROKER}:{MQTT_PORT} | device={DEVICE_ID} | interval={INTERVAL}s", flush=True)

current_value = BASE_OCCUPANCY

while True:
    current_value += random.randint(-MAX_VARIANCE, MAX_VARIANCE)
    current_value = max(0, min(100, current_value))
    value = int(current_value)

    payload = {
        "device_id": DEVICE_ID,
        "sensor": SENSOR_TYPE,
        "value": value,
        "unit": "%",
        "timestamp": int(time.time()),
    }

    topic = f"iot/{DEVICE_ID}/{SENSOR_TYPE}"
    client.publish(topic, json.dumps(payload))
    print(f"[SENSOR1] {topic} -> {payload}", flush=True)

    time.sleep(INTERVAL)
