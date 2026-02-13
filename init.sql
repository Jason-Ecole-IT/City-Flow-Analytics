-- Create sensor_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS sensor_data (
    time TIMESTAMPTZ NOT NULL,
    device_id TEXT,
    sensor TEXT,
    value DOUBLE PRECISION
);

-- Create processed_data table as TimescaleDB hypertable if it doesn't exist
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS processed_data (
    time TIMESTAMPTZ NOT NULL,
    device_id TEXT,
    data JSONB
);

SELECT create_hypertable('processed_data', 'time', if_not_exists => TRUE);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_processed_device_time ON processed_data (device_id, time DESC);