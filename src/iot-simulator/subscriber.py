import os
import json
from datetime import datetime

import psycopg2
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

# -------------------------------------------------------------------
# Chargement éventuel d'un .env local (optionnel)
# (les variables sont surtout fournies par Docker via env_file)
# -------------------------------------------------------------------
load_dotenv()

# -------------------------------------------------------------------
# Configuration MQTT
# -------------------------------------------------------------------
MQTT_BROKER = os.getenv("MQTT_BROKER", "mosquitto")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_USER = os.getenv("MQTT_USER")
MQTT_PASS = os.getenv("MQTT_PASS")

# -------------------------------------------------------------------
# Configuration base de données
# -------------------------------------------------------------------
DB_HOST = os.getenv("DB_HOST", "timescaledb")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME", "iot")

missing = [
    name
    for name, value in [
        ("DB_USER", DB_USER),
        ("DB_PASS", DB_PASS),
    ]
    if not value
]
if missing:
    raise RuntimeError(
        f"Missing required environment variables: {', '.join(missing)}"
    )

print(
    f"[BOOT] MQTT={MQTT_BROKER}:{MQTT_PORT} | "
    f"DB={DB_HOST}:{DB_PORT}/{DB_NAME} (user={DB_USER})"
)

# -------------------------------------------------------------------
# Connexion à la base + création de la table
# -------------------------------------------------------------------
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASS,
    dbname=DB_NAME,
)
cur = conn.cursor()

cur.execute(
    """
    CREATE TABLE IF NOT EXISTS sensor_data (
        time TIMESTAMPTZ NOT NULL,
        device_id TEXT,
        sensor TEXT,
        value DOUBLE PRECISION
    );
"""
)

# create_hypertable est spécifique à TimescaleDB
# Si ce n'est pas Timescale, ce bloc échouera mais ce n'est pas bloquant.
try:
    cur.execute(
        """
        SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);
    """
    )
except Exception as e:
    print(f"[DB] Info: could not create hypertable (probably plain Postgres): {e}")

conn.commit()
print("[DB] Table sensor_data ready")

# -------------------------------------------------------------------
# Callbacks MQTT
# -------------------------------------------------------------------
def on_connect(client, userdata, flags, rc):
    print(f"[MQTT] Connected with result code {rc}")
    client.subscribe("iot/+/+")
    print("[MQTT] Subscribed to topic 'iot/+/+'" )


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"[MQTT] Message received on {msg.topic}: {payload}")

        timestamp = payload.get("timestamp")
        if timestamp is None:
            ts = datetime.utcnow()
        else:
            ts = datetime.utcfromtimestamp(float(timestamp))

        device_id = payload.get("device_id")
        sensor = payload.get("sensor")
        value = payload.get("value")

        cur.execute(
            """
            INSERT INTO sensor_data (time, device_id, sensor, value)
            VALUES (%s, %s, %s, %s)
        """,
            (ts, device_id, sensor, value),
        )
        conn.commit()
        print(f"[DB] Inserted row for device={device_id}, sensor={sensor}")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Failed to handle message: {e}")


# -------------------------------------------------------------------
# Client MQTT
# -------------------------------------------------------------------
client = mqtt.Client()

if MQTT_USER and MQTT_PASS:
    client.username_pw_set(MQTT_USER, MQTT_PASS)

client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT, 60)
print("[BOOT] MQTT client connected, starting loop...")
client.loop_forever()
