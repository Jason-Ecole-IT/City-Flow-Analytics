import os
import json
import time
import psycopg2
import paho.mqtt.client as mqtt

# MQTT
BROKER = os.getenv("MQTT_BROKER")
USERNAME = os.getenv("MQTT_USER")
PASSWORD = os.getenv("MQTT_PASS")

# Database
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME")

# Connexion à la DB
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASS,
    dbname=DB_NAME
)
cur = conn.cursor()

# Créer la table si elle n'existe pas
cur.execute("""
CREATE TABLE IF NOT EXISTS sensor_data (
    time TIMESTAMPTZ NOT NULL DEFAULT now(),
    device_id TEXT,
    sensor TEXT,
    value DOUBLE PRECISION
);
""")
# Convertir en hypertable TimeScaleDB
cur.execute("""
SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);
""")
conn.commit()

# Callback MQTT
def on_connect(client, userdata, flags, rc):
    print("Subscriber connected to broker", rc)
    client.subscribe("iot/+/+")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        device_id = payload.get("device_id")
        sensor = payload.get("sensor")
        value = payload.get("value")
        timestamp = payload.get("timestamp")
        
        cur.execute(
            "INSERT INTO sensor_data (time, device_id, sensor, value) VALUES (to_timestamp(%s), %s, %s, %s)",
            (timestamp, device_id, sensor, value)
        )
        conn.commit()
        print(f"Inserted {payload}")
    except Exception as e:
        print("Error:", e)

client = mqtt.Client()
client.username_pw_set(USERNAME, PASSWORD)
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER, 1883, 60)
client.loop_forever()
