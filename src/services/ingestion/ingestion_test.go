package main

import (
	"testing"
	"time"
)

// TestSensorDataStruct tests the SensorData structure
func TestSensorDataStruct(t *testing.T) {
	sensor := SensorData{
		Time:     time.Now(),
		DeviceID: "device_01",
		Sensor:   "temperature",
		Value:    22.5,
	}

	if sensor.DeviceID != "device_01" {
		t.Errorf("expected device_id 'device_01', got '%s'", sensor.DeviceID)
	}
	if sensor.Sensor != "temperature" {
		t.Errorf("expected sensor 'temperature', got '%s'", sensor.Sensor)
	}
	if sensor.Value != 22.5 {
		t.Errorf("expected value 22.5, got %f", sensor.Value)
	}
}

// TestLatestSensorReadingStruct tests the LatestSensorReading structure
func TestLatestSensorReadingStruct(t *testing.T) {
	reading := LatestSensorReading{
		DeviceID:  "sensor_01",
		Sensor:    "humidity",
		Value:     65.5,
		Timestamp: time.Now(),
	}

	if reading.DeviceID != "sensor_01" {
		t.Errorf("expected device_id 'sensor_01', got '%s'", reading.DeviceID)
	}
	if reading.Sensor != "humidity" {
		t.Errorf("expected sensor 'humidity', got '%s'", reading.Sensor)
	}
	if reading.Value != 65.5 {
		t.Errorf("expected value 65.5, got %f", reading.Value)
	}
}

// TestTransformLatestSensorData tests data transformation
func TestTransformLatestSensorData(t *testing.T) {
	tests := []struct {
		name     string
		input    []SensorData
		expected int
	}{
		{
			name:     "Empty input",
			input:    []SensorData{},
			expected: 0,
		},
		{
			name: "Single sensor reading",
			input: []SensorData{
				{
					Time:     time.Now(),
					DeviceID: "dev_01",
					Sensor:   "temp",
					Value:    22.5,
				},
			},
			expected: 1,
		},
		{
			name: "Multiple readings",
			input: []SensorData{
				{Time: time.Now(), DeviceID: "dev_01", Sensor: "temp", Value: 22.5},
				{Time: time.Now(), DeviceID: "dev_01", Sensor: "humidity", Value: 65.0},
				{Time: time.Now(), DeviceID: "dev_02", Sensor: "temp", Value: 20.0},
			},
			expected: 3,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := TransformLatestSensorData(tt.input)
			if len(result) != tt.expected {
				t.Errorf("expected %d readings, got %d", tt.expected, len(result))
			}
		})
	}
}

// TestGroupByDevice tests grouping functionality
func TestGroupByDevice(t *testing.T) {
	readings := []LatestSensorReading{
		{DeviceID: "dev_01", Sensor: "temp", Value: 22.5, Timestamp: time.Now()},
		{DeviceID: "dev_01", Sensor: "humidity", Value: 65.0, Timestamp: time.Now()},
		{DeviceID: "dev_02", Sensor: "temp", Value: 20.0, Timestamp: time.Now()},
		{DeviceID: "dev_03", Sensor: "pressure", Value: 1013.25, Timestamp: time.Now()},
	}

	grouped := GroupByDevice(readings)

	// Check that we have 3 devices
	if len(grouped) != 3 {
		t.Errorf("expected 3 devices, got %d", len(grouped))
	}

	// Check dev_01 has 2 sensors
	if len(grouped["dev_01"]) != 2 {
		t.Errorf("expected dev_01 to have 2 sensors, got %d", len(grouped["dev_01"]))
	}

	// Check dev_02 has 1 sensor
	if len(grouped["dev_02"]) != 1 {
		t.Errorf("expected dev_02 to have 1 sensor, got %d", len(grouped["dev_02"]))
	}
}

// TestSerializeToJSON tests JSON serialization
func TestSerializeToJSON(t *testing.T) {
	reading := LatestSensorReading{
		DeviceID:  "test_device",
		Sensor:    "temperature",
		Value:     22.5,
		Timestamp: time.Now(),
	}

	jsonData, err := SerializeToJSON(reading)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if len(jsonData) == 0 {
		t.Error("expected non-empty JSON output")
	}

	// Check if output contains expected fields
	jsonStr := string(jsonData)
	if !contains(jsonStr, "test_device") {
		t.Error("JSON should contain device_id")
	}
	if !contains(jsonStr, "temperature") {
		t.Error("JSON should contain sensor name")
	}
}

// TestSerializeToJSONWithSlice tests JSON serialization with slice
func TestSerializeToJSONWithSlice(t *testing.T) {
	readings := []LatestSensorReading{
		{DeviceID: "dev_01", Sensor: "temp", Value: 22.5, Timestamp: time.Now()},
		{DeviceID: "dev_02", Sensor: "humidity", Value: 65.0, Timestamp: time.Now()},
	}

	jsonData, err := SerializeToJSON(readings)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if len(jsonData) == 0 {
		t.Error("expected non-empty JSON output")
	}
}

// TestGetEnvOrDefault tests environment variable handling
func TestGetEnvOrDefault(t *testing.T) {
	tests := []struct {
		name         string
		key          string
		defaultValue string
		expected     string
	}{
		{
			name:         "Non-existent key with default",
			key:          "NON_EXISTENT_KEY_12345",
			defaultValue: "default_value",
			expected:     "default_value",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := getEnvOrDefault(tt.key, tt.defaultValue)
			if result != tt.expected {
				t.Errorf("expected '%s', got '%s'", tt.expected, result)
			}
		})
	}
}

// Helper function to check if string contains substring
func contains(s, substr string) bool {
	for i := 0; i < len(s)-len(substr)+1; i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

// TestSensorValueRanges tests sensor value validation ranges
func TestSensorValueRanges(t *testing.T) {
	tests := []struct {
		name          string
		sensorType    string
		value         float64
		shouldBeValid bool
	}{
		{"Temperature low", "temperature", 18.0, true},
		{"Temperature valid", "temperature", 22.5, true},
		{"Temperature high", "temperature", 30.0, true},
		{"Humidity low", "humidity", 30.0, true},
		{"Humidity valid", "humidity", 65.5, true},
		{"Humidity high", "humidity", 80.0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			isValid := validateSensorValue(tt.sensorType, tt.value)
			if isValid != tt.shouldBeValid {
				t.Errorf("validation result mismatch for %s: expected %v, got %v",
					tt.name, tt.shouldBeValid, isValid)
			}
		})
	}
}

// Helper function to validate sensor values
func validateSensorValue(sensorType string, value float64) bool {
	switch sensorType {
	case "temperature":
		return value >= 18 && value <= 30
	case "humidity":
		return value >= 30 && value <= 80
	default:
		return true
	}
}

// BenchmarkTransformLatestSensorData benchmarks the transformation function
func BenchmarkTransformLatestSensorData(b *testing.B) {
	data := []SensorData{
		{Time: time.Now(), DeviceID: "dev_01", Sensor: "temp", Value: 22.5},
		{Time: time.Now(), DeviceID: "dev_02", Sensor: "humidity", Value: 65.0},
		{Time: time.Now(), DeviceID: "dev_03", Sensor: "pressure", Value: 1013.25},
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		TransformLatestSensorData(data)
	}
}

// BenchmarkGroupByDevice benchmarks the grouping function
func BenchmarkGroupByDevice(b *testing.B) {
	readings := []LatestSensorReading{
		{DeviceID: "dev_01", Sensor: "temp", Value: 22.5, Timestamp: time.Now()},
		{DeviceID: "dev_02", Sensor: "humidity", Value: 65.0, Timestamp: time.Now()},
		{DeviceID: "dev_03", Sensor: "pressure", Value: 1013.25, Timestamp: time.Now()},
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		GroupByDevice(readings)
	}
}
