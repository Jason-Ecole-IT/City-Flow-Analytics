package main

import (
	"encoding/json"
	"fmt"
	"time"
)

// LatestSensorReading represents the latest reading from a single sensor
type LatestSensorReading struct {
	DeviceID  string    `json:"device_id"`
	Sensor    string    `json:"sensor"`
	Value     float64   `json:"value"`
	Timestamp time.Time `json:"timestamp"`
}

// TransformLatestSensorData converts raw sensor data to latest readings per sensor format
func TransformLatestSensorData(rawData []SensorData) []LatestSensorReading {
	if len(rawData) == 0 {
		return []LatestSensorReading{}
	}

	var readings []LatestSensorReading
	for _, data := range rawData {
		reading := LatestSensorReading{
			DeviceID:  data.DeviceID,
			Sensor:    data.Sensor,
			Value:     data.Value,
			Timestamp: data.Time,
		}
		readings = append(readings, reading)
	}

	return readings
}

// GroupByDevice organizes latest sensor readings by device ID
// Efficient for handling multiple sensors across many devices
func GroupByDevice(readings []LatestSensorReading) map[string][]LatestSensorReading {
	grouped := make(map[string][]LatestSensorReading)

	for _, reading := range readings {
		grouped[reading.DeviceID] = append(grouped[reading.DeviceID], reading)
	}

	return grouped
}

// SerializeToJSON converts processed data to JSON byte array
func SerializeToJSON(data interface{}) ([]byte, error) {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to marshal data to JSON: %w", err)
	}
	return jsonData, nil
}

// PrettyPrintLatestReadings prints latest sensor readings in a readable format
func PrettyPrintLatestReadings(readings []LatestSensorReading) {
	fmt.Println("\n=== Latest Sensor Readings ===")
	for _, reading := range readings {
		fmt.Printf("[%s] Device: %s, Sensor: %s, Value: %.2f, Time: %s\n",
			reading.Timestamp.Format("15:04:05"), reading.DeviceID, reading.Sensor, reading.Value,
			reading.Timestamp.Format("2006-01-02 15:04:05"))
	}
}

// PrintDeviceGroupSummary prints a summary of readings grouped by device
func PrintDeviceGroupSummary(grouped map[string][]LatestSensorReading) {
	fmt.Printf("\n=== Summary: %d Active Devices ===\n", len(grouped))
	for deviceID, readings := range grouped {
		fmt.Printf("Device %s: %d sensors\n", deviceID, len(readings))
		for _, reading := range readings {
			fmt.Printf("  - %s: %.2f (updated %s ago)\n",
				reading.Sensor, reading.Value,
				time.Since(reading.Timestamp).String())
		}
	}
}
