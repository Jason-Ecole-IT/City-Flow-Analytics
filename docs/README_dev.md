# Dev Setup

## Prérequis

- Docker & Docker Compose
- Node.js >= 20
- Go >= 1.23

## Lancer les services en local

```sh
docker-compose up --build
```

## Services

- Frontend → [http://localhost:4000](http://localhost:4000)
- Ingestion → port 8080
- Simulateur → envoie des données de test

## Accès à la BD

docker compose exec timescaledb psql -U iot_user -d iot

## Visualisation de la BD

`SELECT * FROM sensor_data;`

## Création de la table sensor_data

```SQL
CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    device_id TEXT,
    sensor TEXT,
    value DOUBLE PRECISION
);
```
## Vider la table sensor_data

`TRUNCATE TABLE sensor_data;`