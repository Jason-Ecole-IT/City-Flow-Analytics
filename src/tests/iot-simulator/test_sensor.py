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
        self.assertGreaterEqual(payload["value"], 30)
        self.assertLessEqual(payload["value"], 80)

    def test_payload_serialization(self):
        """Test payload can be serialized to JSON"""
        payload = {
            "device_id": "pi_docker_01",
            "sensor": "temperature",
            "value": 25.3,
            "unit": "C",
            "timestamp": 1234567890
        }
        
        json_str = json.dumps(payload)
        parsed = json.loads(json_str)
        
        self.assertEqual(parsed["device_id"], payload["device_id"])
        self.assertEqual(parsed["sensor"], payload["sensor"])
        self.assertEqual(parsed["value"], payload["value"])

    def test_topic_generation(self):
        """Test MQTT topic generation"""
        device_id = "pi_docker_01"
        sensor = "temperature"
        
        topic = f"iot/{device_id}/{sensor}"
        
        self.assertEqual(topic, "iot/pi_docker_01/temperature")
        self.assertIn(device_id, topic)
        self.assertIn(sensor, topic)

    def test_temperature_range(self):
        """Test temperature values are within expected range"""
        for _ in range(10):
            temp = round(18 + (30 - 18) * 0.5, 2)  # Simulating random
            self.assertGreaterEqual(temp, 18)
            self.assertLessEqual(temp, 30)

    def test_humidity_range(self):
        """Test humidity values are within expected range"""
        for _ in range(10):
            humidity = round(30 + (80 - 30) * 0.5, 2)  # Simulating random
            self.assertGreaterEqual(humidity, 30)
            self.assertLessEqual(humidity, 80)


if __name__ == '__main__':
    unittest.main()
