# City Flow Analytics - Test Suite

This directory contains test files for all components of the City Flow Analytics project.

## Test Structure

```md
tests/
├── frontend/          # React/Express frontend tests
├── iot-simulator/     # IoT sensor simulator tests
├── services/          # Microservices tests
│   └── ingestion/     # Ingestion service tests
└── README.md          # This file
```

## Running Tests

### Frontend Tests

Frontend tests use **Jest** and **Supertest** for HTTP testing.

```bash
cd src/frontend
npm install --save-dev jest supertest
npm test
```

**Test Coverage:**

- Express server startup and routing
- HTTP endpoint responses
- Content type validation
- 404 error handling

### IoT Simulator Tests

IoT tests use **pytest** for Python unit testing.

```bash
cd src/iot-simulator
pip install pytest paho-mqtt
pytest tests/
```

**Sensor Tests (`test_sensor.py`):**

- Temperature and humidity payload generation
- Sensor value range validation (18-30°C, 30-80%)
- JSON serialization
- MQTT topic format validation

**Subscriber Tests (`test_subscriber.py`):**

- MQTT payload parsing
- Required field validation
- Error handling for malformed data
- Topic subscription pattern matching
- Data type validation

### Services Tests

Services are written in Go and use **Go's built-in testing library**.

```bash
cd src/services/ingestion
go test -v
```

**Ingestion Service Tests (`ingestion_test.go`):**

- Service startup/exit messages
- Tick counter logic
- Loop boundary conditions
- Message format validation

## Notes

- **Prediction Service** and **Routing Service** have no implementation yet, so no tests were created
- Tests are designed to validate actual code behavior - no mock or hallucinated tests
- All tests can run independently without external services (except integration tests would require MQTT broker and PostgreSQL)

## Future Test Additions

As the following services are implemented, tests should be added:

- `tests/services/prediction/` - for prediction service logic
- `tests/services/routing/` - for routing algorithm logic
- Integration tests - for end-to-end data flow validation
