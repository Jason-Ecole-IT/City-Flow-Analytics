package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// get raw data (SQL format) from db and extract useful information, store it in db (JSON format) for prediction and routing services

// Env variables
var (
	DB_HOST = getEnvOrDefault("DB_HOST", "timescaledb")
	DB_PORT = getEnvOrDefault("DB_PORT", "5432")
	DB_USER = os.Getenv("DB_USER")
	DB_PASS = os.Getenv("DB_PASS")
	DB_NAME = getEnvOrDefault("DB_NAME", "iot")
)

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	// validate db credentials
	if DB_USER == "" || DB_PASS == "" {
		panic("Missing required environment variables: DB_USER, DB_PASS")
	}

	fmt.Printf("[BOOT] Ingestion Service Starting\n")
	fmt.Printf("[BOOT] DB Connection: %s:%s/%s (user=%s)\n", DB_HOST, DB_PORT, DB_NAME, DB_USER)

	// Connect to the database with retry logic
	var db *DBConnection
	var err error
	maxRetries := 5
	retryDelay := 2 * time.Second

	for attempt := 1; attempt <= maxRetries; attempt++ {
		fmt.Printf("[DB] Connection attempt %d/%d...\n", attempt, maxRetries)
		db, err = NewDBConnection(DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME)
		if err == nil {
			fmt.Println("[DB] Connection successful")
			break
		}
		if attempt < maxRetries {
			fmt.Printf("[WARN] Connection failed: %v. Retrying in %v...\n", err, retryDelay)
			time.Sleep(retryDelay)
		}
	}

	if db == nil {
		log.Fatalf("[ERROR] Failed to connect to database after %d attempts: %v\n", maxRetries, err)
	}
	defer db.Close()

	fmt.Println("[INGESTION] Service started successfully")

	// Setup signal handler for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Create a ticker for periodic data ingestion (30 seconds)
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	// Run initial ingestion cycle immediately
	fmt.Println("[INGESTION] Running initial ingestion cycle...")
	processData(db)

	// Keep the service running and periodically fetch and process data
	for {
		select {
		case <-ticker.C:
			processData(db)
		case sig := <-sigChan:
			fmt.Printf("\n[SHUTDOWN] Received signal: %v\n", sig)
			fmt.Println("[SHUTDOWN] Closing database connection...")
			db.Close()
			fmt.Println("[SHUTDOWN] Service stopped")
			os.Exit(0)
		}
	}
}

// processData retrieves the latest sensor data and processes it
func processData(db *DBConnection) {
	fmt.Println("\n[PROCESS] Starting 30-second data ingestion cycle...")

	// Get latest readings for each sensor on each device
	rawData, err := db.GetLatestSensorReadings()
	if err != nil {
		log.Printf("[ERROR] Failed to retrieve latest sensor readings: %v\n", err)
		return
	}

	if len(rawData) == 0 {
		fmt.Println("[WARN] No sensor data available in database yet")
		return
	}

	fmt.Printf("[DATA] Retrieved %d latest sensor readings\n", len(rawData))

	// Transform to latest reading format
	fmt.Println("[PROCESS] Processing latest sensor readings...")
	latestReadings := TransformLatestSensorData(rawData)

	// Marshal to JSON for downstream services
	jsonData, err := SerializeToJSON(latestReadings)
	if err != nil {
		log.Printf("[ERROR] Failed to serialize data to JSON: %v\n", err)
		return
	}

	// Log JSON output
	fmt.Println("[OUTPUT] Latest sensor data (JSON format):")
	fmt.Println(string(jsonData))

	// Group and display by device for monitoring
	groupedByDevice := GroupByDevice(latestReadings)
	PrintDeviceGroupSummary(groupedByDevice)

	fmt.Printf("[SUCCESS] Ingestion cycle complete: %d sensors from %d devices\n", len(latestReadings), len(groupedByDevice))
}
