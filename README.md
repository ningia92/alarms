# 🚨 Alarm Dashboard System

This project is a comprehensive, real-time alarm monitoring and management system designed for reliability and ease of use. It features a modern frontend dashboard built with **React** and a robust backend powered by **Node.js**, working together to provide instant updates and control over a network of alarm devices.

## Features

-   **Real-time Monitoring**: A dynamic dashboard displays the status of all alarms (`on`, `off`, `down`), with instant updates pushed from the backend via WebSockets.
-   **Alarm Management**: Users can view active alarms, access detailed information for each room (ID, block, phone number), and deactivate alarms with specific, logged reasons.
-   **Scalable Architecture**: The system is built with a decoupled frontend and backend, fully containerized with Docker for easy deployment and scalability. The backend uses Redis for high-performance state management.
-   **User-Friendly Interface**: The frontend is designed with a clean and intuitive UI, featuring collapsible sections for room blocks, detailed modals, and support for both light and dark modes.
-   **Automated Alerts**: In addition to WebSocket notifications, the system can place automated phone calls to a room when its alarm is triggered.

## Tech Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express, TypeScript, Redis, WebSockets
-   **Deployment**: Docker, Docker Compose, Nginx

## Getting Started

To get the entire system up and running, you will need **Docker** and **Docker Compose** installed on your machine. The project is configured to run with a single command.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ningia92/alarms.git
    cd alarms
    ```

2.  **Environment Variables:**
    Before launching the application, you need to set up the environment variables for the backend. In the `backend` directory, create a `.env` file. You can copy the contents of `.env.example` (if available) and fill in your details. This file is required for the backend to connect to Redis and other services.

3.  **Populate the Database (First-time setup):**
    The system uses data from `backend/src/db/data.json` to configure the rooms and alarms in Redis. Before starting the services for the first time, you need to run the population script.

4.  **Run with Docker Compose:**
    From the root of the `alarms` directory, run the following command to build and start all containers:
    ```bash
    docker-compose up --build
    ```

5.  **Access the application:**
    -   **Frontend Dashboard**: `http://localhost:8080`
    -   **Backend API**: `http://localhost:3000`
    -   **WebSocket Server**: `ws://localhost:3000`

## Project Structure

```
alarms/
├── backend/          # Node.js, Express, and WebSocket backend
│   ├── src/
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/         # React, Vite, and Tailwind CSS frontend
├── src/
├── Dockerfile
└── docker-compose.yml
```
##

For more detailed information on the architecture, API endpoints, and development scripts for each part of the system, please refer to the `README.md` files located within the `backend` and `frontend` directories.