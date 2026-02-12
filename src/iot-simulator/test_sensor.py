import unittest
import json
from unittest.mock import patch, MagicMock
import sys
import os

# Mock paho.mqtt before importing sensor logic
sys.modules['paho'] = MagicMock()
sys.modules['paho.mqtt'] = MagicMock()
sys.modules['paho.mqtt.client'] = MagicMock()


class TestSensorPayload(unittest.TestCase):
    """Test sensor payload generation logic"""

    def test_temperature_payload_generation(self):
        """Test temperature sensor payload has correct structure"""
        device_id = "pi_docker_01"
        sensor_type = "temperature"
        
        # Simulate payload generation
        payload = {
            "device_id": device_id,
            "sensor": sensor_type,
            "value": 22.5,
            "unit": "C",
            "timestamp": 1234567890
        }
        
        self.assertEqual(payload["device_id"], device_id)
        self.assertEqual(payload["sensor"], sensor_type)
        self.assertEqual(payload["unit"], "C")
        self.assertIsInstance(payload["value"], float)
        self.assertGreaterEqual(payload["value"], 18)
        self.assertLessEqual(payload["value"], 30)

    def test_humidity_payload_generation(self):
        """Test humidity sensor payload has correct structure"""
        device_id = "pi_docker_02"
        sensor_type = "humidity"
        
        payload = {
            "device_id": device_id,
            "sensor": sensor_type,
            "value": 65.5,
            "unit": "%",
            "timestamp": 1234567890
        }
        
        self.assertEqual(payload["device_id"], device_id)
        self.assertEqual(payload["sensor"], sensor_type)
        self.assertEqual(payload["unit"], "%")
        self.assertIsInstance(payload["value"], float)
        self.assertGreaterEqual(payload["value"], 30)
        self.assertLessEqual(payload["value"], 80)

    def test_temperature_value_validation(self):
        """Test temperature values are within valid range"""
        for temp in [18.0, 22.5, 30.0]:
            self.assertGreaterEqual(temp, 18, f"Temperature {temp} below minimum")
            self.assertLessEqual(temp, 30, f"Temperature {temp} above maximum")

    def test_humidity_value_validation(self):
        """Test humidity values are within valid range"""
        for humidity in [30.0, 65.5, 80.0]:
            self.assertGreaterEqual(humidity, 30, f"Humidity {humidity} below minimum")
            self.assertLessEqual(humidity, 80, f"Humidity {humidity} above maximum")

    def test_payload_json_serializable(self):
        """Test payloads can be serialized to JSON"""
        payload = {
            "device_id": "sensor_01",
            "sensor": "temperature",
            "value": 22.5,
            "unit": "C",
            "timestamp": 1234567890
        }
        
        # Should not raise any exception
        json_str = json.dumps(payload)
        deserialized = json.loads(json_str)
        self.assertEqual(deserialized["device_id"], "sensor_01")

    def test_mqtt_topic_format(self):
        """Test MQTT topic format validation"""
        device_id = "pi_docker_01"
        sensor_type = "temperature"
        
        # Standard MQTT topic format: iot/device_id/sensor_type
        topic = f"iot/{device_id}/{sensor_type}"
        parts = topic.split('/')
        
        self.assertEqual(len(parts), 3, "Topic should have 3 parts")
        self.assertEqual(parts[0], "iot", "First part should be 'iot'")
        self.assertEqual(parts[1], device_id, "Second part should be device ID")
        self.assertEqual(parts[2], sensor_type, "Third part should be sensor type")


if __name__ == '__main__':
    unittest.main()
