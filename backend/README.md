# Alarm System Backend

This backend is the core of the alarm management system, built with **Node.js**, **Express**, and **TypeScript**. It is responsible for handling incoming data from alarm devices, managing the application state with **Redis**, and communicating in real-time with the frontend via **WebSockets**.

## Features

-   **RESTful API**: Exposes GET endpoints (`/rooms/:id/alarm/on` and `/rooms/:id/alarm/off`) for alarm devices to report their status.
-   **WebSocket Server**: Provides a real-time communication channel with the frontend. It sends updates on alarm statuses (`alarm_on`, `alarm_off`, `alarm_down`) and delivers the complete list of rooms upon connection. It also includes a heartbeat mechanism to handle broken connections.
-   **Redis Integration**: Utilizes Redis for fast and persistent storage of room and alarm data. The data is structured using Hashes for efficient access. A utility script is available to populate the database with initial data from a JSON file.
-   **Device Authorization**: A dedicated middleware (`authorizeDevice`) validates the IP address of incoming requests to ensure only authorized alarm devices can interact with the API.
-   **Comprehensive Logging**: All significant alarm events (activation, deactivation, device down) are logged to a file (`logs/alarm-logs.txt`) with detailed descriptions, timestamps, and reasons for deactivation, providing a clear audit trail.
-   **Health Checks**: A service can be enabled to periodically check the status of each alarm device by sending an HTTP HEAD request. If a device is unreachable, its status is updated to "down" and a notification is sent to the frontend.
-   **Automated Phone Calls**: When a room alarm is triggered, the system automatically makes a call to the room's phone number via the Wildix PBX API, providing an immediate alert.
-   **Alarm Configuration Utility**: Includes a script (`config-alarms.ts`) to configure the alarm devices, setting the callback URLs for different types of button presses (short, long, double, triple).

## Tech Stack

-   **Node.js**
-   **Express**
-   **TypeScript**
-   **Redis**
-   **WebSockets (`ws`)**
-   **Docker & Docker Compose**
-   **TSX** for development
-   **ESLint** for code linting

## API Endpoints

The following endpoints are exposed to be called by the alarm devices:

-   `GET /rooms/:id/alarm/on`: Activates the alarm for the specified room ID.
-   `GET /rooms/:id/alarm/off`: Deactivates the alarm for the specified room ID.

*Note: These endpoints, for device limitations, use the GET method to change the server's state. Response headers are set to prevent caching issues.*

## WebSocket Events

The WebSocket server communicates with the frontend using the following message types:

-   **`room_list`**: Sent to a client upon connection, containing the full list of rooms and their current alarm status. Also sent after an alarm is turned off to provide the updated state of all rooms.
-   **`alarm_on`**: Broadcast to all clients when an alarm is activated.
-   **`alarm_off`**: Sent from the client to the server to request the deactivation of an alarm.
-   **`alarm_down`**: Broadcast to all clients when a device becomes unreachable.

## Getting Started

To run the backend service locally, you will need Node.js and npm installed.

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory. This file must contain the following variables:

    ```env
    # Server Configuration
    PORT=server_port
    SERVER_IP=server_ip

    # Regex for authorizing alarm device IPs
    IP_REGEX=ip_regex

    # Wildix PBX API for phone calls
    PBX_URL=pxb_url
    PBX_USER=your_username
    PBX_PWD=your_password

    # Redis Configuration
    REDIS_HOST=redis_host
    REDIS_PORT=redis_port
    ```
    *Note: `REDIS_HOST` should be set to the service name defined in `docker-compose.yml` (e.g., `redis`).*

4.  **Run the data loader (optional):**
    If you are setting up the database for the first time, run this script to populate Redis with the initial data from `src/db/data.json`.
    ```bash
    npx tsx src/utils/populate-redis.ts
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the server with `tsx` for hot-reloading on file changes.

## Data Structure (`data.json`)

The `backend/src/db/data.json` file contains an array of objects, where each object represents a room. This data is used to populate the Redis database.

Each object has the following structure:

-   **`id`**: A unique identifier for the room (e.g., "11-01").
-   **`block`**: The building block number (only for rooms).
-   **`phone`**: The phone number associated with the room (only for rooms).
-   **`alarm`**: An object containing the alarm device's configuration:
    -   **`ip`**: The IP address of the device.
    -   **`inputChannel`**: The input channel of the device.
    -   **`status`**: The initial alarm status (e.g., "off").
    -   **`lastActivation`**: Timestamp of the last activation (initially empty).

**Example of json room:**
```json
[
  {
    "id": "101",
    "block": "1",
    "phone": "1101",
    "alarm": {
      "ip": "room_ip",
      "inputChannel": "0",
      "status": "off",
      "lastActivation": ""
    }
  }
]
```

## Available Scripts

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run build`: Compiles the TypeScript code to JavaScript for production.
-   `npm run start`: Starts the compiled application for production.
-   `npm run lint`: Lints the codebase for potential errors and style issues.
-   `npm run type-check`: Runs the TypeScript compiler to check for type errors without emitting files.

## Docker Deployment

The application is containerized and can be easily run using Docker and Docker Compose.

1.  **Build and run the containers:**
    Make sure your `.env` file is correctly configured in the `backend` directory. Then, from the same directory, run:
    ```bash
    docker compose up
    ```
    This command will build the backend image, start a Redis container, and run the application, connecting them on the same network. The backend will be accessible on port `3000`.

    Some useful options for the ``` docker compose up ``` command:
    ```bash
    Options:
    -f, -file stringArray      Specify an alternate environment file
    -d, --detach               Run container in background and print container ID
    --build                    Build images before starting containers (use it when you have to rebuild the image)
    ```

## Project Structure

```bash
src/
├── controllers/    # Express route handlers for processing incoming requests.
├── db/             # Contains the Redis client, data repositories, and initial data.
├── middleware/     # Custom Express middleware, like the device authorization filter.
├── routes/         # Express route definitions that map endpoints to controllers.
├── services/       # Core business logic, such as managing rooms, alarms, and health checks.
├── types/          # TypeScript type definitions for the application.
├── utils/          # Utility scripts for logging, alarm configuration, and DB population.
├── websocket/      # WebSocket server logic, including connection handling and message broadcasting.
└── server.ts       # Main application entry point where the Express server and WebSocket server are initialized.
```