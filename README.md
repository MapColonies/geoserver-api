
# Geoserver-Api

This service defines a REST API for interacting with GeoServer administration, including CRUD actions on workspaces, data stores, feature types, and WFS settings.
## API
Check out the OpenAPI spec [here](/openapi3.yaml)

## Run Locally

Clone the project

```bash
  git clone https://github.com/MapColonies/geoserver-api
```

Go to the project directory

```bash
  cd geoserver-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Environment Variables
**NOTE:** All DATASTORE variables are referring to the postgres on which the polygon_parts schema is located in
|Variable Name                       |Description                                                               |Default Value                |Available Values   |
|------------------------------------|--------------------------------------------------------------------------|-----------------------------|-----------|
|`SERVER_PORT`                       |Port on which the server listens for incoming requests.	                  |8080                         |
|`REQUEST_PAYLOAD_LIMIT`             |Maximum payload limit for incoming requests.	                            |1mb                          |
|`RESPONSE_COMPRESSION_ENABLED`      |Enable or disable response compression (boolean).                         |true                         |
|`GEOSERVER_URL`                     |Base URL of the Geoserver service.	**NOTE:** dont forget to add the /geoserver - this is the entry point                                     |http://localhost:8081/geoserver        |
|`GEOSERVER_USER`                    |Geoserver admin username	**NOTE:** change this to the value corresponding with the geoserver you are communicating with                                                |admin                        |
|`GEOSERVER_PASSWORD`                |Geoserver admin password  **NOTE:** change this to the value corresponding with the geoserver you are communicating with                                                |geoserver                    |
|`DATASTORE_USERNAME`                |Postgres username                                                         |postgres                     |
|`DATASTORE_PASSWORD`                |Postgres password                                                         |postgres                     |
|`DATASTORE_HOST`                    |Postgres host                                                             |localhost                    |
|`DATASTORE_PORT`                    |Postgres port                                                             |5432                         |
|`DATASTORE_SCHEMA`                  |Postgres DB schema                                                        |polygon_parts                |
|`DATASTORE_NAME`                    |Postgres DB name                                                          |postgres                     |
|`DATASTORE_TYPE`                    |DB type                                                                   |postgis                      |
|`DATASTORE_SSL_MODE`                |Postgres sslmode                                                          |DISABLE                      |DISABLE, ALLOW, PREFER, REQUIRE, VERIFY_CA , VERIFY_FULL |
|`GEOSERVER_SRS`                     |Coordinates srs system                                                    |EPSG:4326                    |
|`GEOSERVER_NUM_OF_DECIMALS`         |number of decimals on float numbers like footprint coordinates, resolutionDegree etc                    |100                          |
|`HTTP_RETRY_ATTEMPTS`               |How many retries should the service make if a request fails.              |5                            |
|`HTTP_RETRY_DELAY`                  |The delay between each http retry if a request fails.                     |exponential                  |
|`HTTP_RETRY_RESET_TIMEOUT`          |Defines if the timeout should be reset between retries                    |true                         |
|`TELEMETRY_SERVICE_NAME`            |Name of the telemetry service.	                                          |(not set)                    |
|`TELEMETRY_HOST_NAME`               |Hostname for the telemetry service.                                       |(not set)                    |
|`TELEMETRY_SERVICE_VERSION`         |Version of the telemetry service.	                                        |(not set)                    |
|`LOG_LEVEL`                         |Logging level for the application (e.g., info, debug, warn, error, fatal).|info                         |
|`LOG_PRETTY_PRINT_ENABLED`          |Enable or disable pretty printing for logs (boolean).                     |false                        |
|`TELEMETRY_TRACING_ENABLED`         |Enable or disable tracing (boolean).	                                    |(not set)                    |
|`TELEMETRY_TRACING_URL`             |URL for the tracing service.	                                            |(not set)                    |
|`TELEMETRY_METRICS_ENABLED`         |Enable or disable metrics collection (boolean).	                          |(not set)                    |
|`TELEMETRY_METRICS_URL`             |URL for the metrics service.	                                            |(not set)                    |
|`TELEMETRY_METRICS_INTERVAL`        |Interval (in seconds) for sending metrics data.	                          |(not set)                    |

## Running Tests GEOSERVER_NUM_OF_DECIMALS

To run tests, run the following command

```bash

npm run test

```

To only run unit tests:
```bash
npm run test:unit
```

To only run integration tests:
```bash
npm run test:integration
```
## Docker

    # Build the Docker image
    docker build -t geoserver-api .
    
    # Run the Docker container
    docker run -d -p 3000:3000 geoserver
