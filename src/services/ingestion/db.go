package main

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// SensorData represents a raw sensor reading from the database
type SensorData struct {
	Time     time.Time
	DeviceID string
	Sensor   string
	Value    float64
}

// DBConnection holds the database connection pool
type DBConnection struct {
	conn *sql.DB
}

// NewDBConnection creates and returns a new database connection
func NewDBConnection(host, port, user, password, dbname string) (*DBConnection, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &DBConnection{conn: db}, nil
}

// Close closes the database connection
func (dbc *DBConnection) Close() error {
	return dbc.conn.Close()
}

// GetLatestSensorReadings retrieves the most recent reading for each sensor on each device
// Optimized for multiple sensors (targets 6+ devices with multiple sensors each)
// Uses DISTINCT ON for efficient PostgreSQL queries
func (dbc *DBConnection) GetLatestSensorReadings() ([]SensorData, error) {
	query := `
		SELECT DISTINCT ON (device_id, sensor) time, device_id, sensor, value
		FROM sensor_data
		ORDER BY device_id, sensor, time DESC
	`

	rows, err := dbc.conn.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query latest sensor readings: %w", err)
	}
	defer rows.Close()

	var data []SensorData
	for rows.Next() {
		var sd SensorData
		err := rows.Scan(&sd.Time, &sd.DeviceID, &sd.Sensor, &sd.Value)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		data = append(data, sd)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return data, nil
}

// EnsureProcessedTable creates the processed_data table if it does not exist
func (dbc *DBConnection) EnsureProcessedTable() error {
	query := `
	CREATE TABLE IF NOT EXISTS processed_data (
		time TIMESTAMPTZ NOT NULL,
		device_id TEXT,
		data JSONB
	);
	`
	_, err := dbc.conn.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to ensure processed_data table: %w", err)
	}

	// Create an index to speed up queries by device and time
	_, _ = dbc.conn.Exec(`CREATE INDEX IF NOT EXISTS idx_processed_device_time ON processed_data (device_id, time DESC);`)
	return nil
}

// SaveProcessedData inserts a JSON blob for a device at the given timestamp
func (dbc *DBConnection) SaveProcessedData(deviceID string, ts time.Time, jsonData []byte) error {
	query := `
	INSERT INTO processed_data (time, device_id, data)
	VALUES ($1, $2, $3::jsonb)
	`
	_, err := dbc.conn.Exec(query, ts, deviceID, string(jsonData))
	if err != nil {
		return fmt.Errorf("failed to insert processed data for device %s: %w", deviceID, err)
	}
	return nil
}
