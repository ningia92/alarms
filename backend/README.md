# Alarm System Backend

This backend, built with **Node.js**, **Express**, and **TypeScript**, serves as the core of the alarm management system. It handles incoming data from alarm devices, manages application state with **Redis**, and communicates with the frontend in real-time via **WebSockets**.

## Features

- **RESTful API**: Exposes endpoints for alarm devices to report their status.
- **WebSocket Server**: Pushes real-time updates to all connected frontend clients, ensuring the dashboard is always in sync.
- **Redis Integration**: Uses Redis for fast and persistent storage of room and alarm statuses.
- **Device Authorization**: A middleware layer ensures that only authorized devices can trigger or update alarms.
- **Comprehensive Logging**: Logs all alarm-related events with timestamps and reasons for deactivation, providing a clear audit trail.

## Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **Redis**
- **WebSockets (`ws`)**
- **Docker** and **Docker Compose** for containerization.

## Getting Started

To run the backend service independently, you will need Node.js and npm installed.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory. This file should contain the necessary environment variables for connecting to Redis and other services.

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the server with `tsx` for hot-reloading on file changes.

## Available Scripts

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles the TypeScript code to JavaScript for production.
- `npm run start`: Starts the compiled application for production.
- `npm run lint`: Lints the codebase for potential errors and style issues.

## Project Structure

```
src/
├── controllers/    # Express route handlers
├── db/             # Redis client and data repositories
├── middleware/     # Custom Express middleware
├── routes/         # Express route definitions
├── services/       # Business logic and services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and scripts
├── websocket/      # WebSocket server and message handlers
└── server.ts       # Main application entry point
```