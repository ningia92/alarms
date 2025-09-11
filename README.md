# 🚨 Alarm Dashboard System

This project is a comprehensive, real-time alarm monitoring and management system designed for reliability and ease of use. It features a modern frontend dashboard and a robust backend, working together to provide instant updates and control over a network of alarm devices.

## Features

- **Real-time Monitoring**: A dynamic dashboard that displays the status of all alarms, with instant updates pushed from the backend via WebSockets.
- **Alarm Management**: Users can view active alarms, access detailed information for each room, and deactivate alarms with specific, logged reasons.
- **Scalable Architecture**: The system is built with a decoupled frontend and backend, containerized with Docker for easy deployment and scalability.
- **User-Friendly Interface**: The frontend is designed with a clean and intuitive UI, including light and dark modes for user comfort.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Redis, WebSockets
- **Deployment**: Docker, Docker Compose

## Getting Started

To get the entire system up and running, you will need Docker and Docker Compose installed on your machine.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ningia92/alarms.git
    cd alarms
    ```

2.  **Environment Variables:**

    Before running the application, you need to set up the environment variables for the backend. In the `backend` directory, create a `.env` file and add the necessary configuration.

3.  **Run with Docker Compose:**

    From the root of the `alarms/backend` directory and `alarms/frontned`, run the following command to build and start the containers for the frontend, backend, and Redis database:

    ```bash
    docker compose [OPTIONS] up

    Options:
     -f, -file stringArray     Specify an alternate environment file
     -d, --detach      Run container in background and print container ID
    ```

4.  **Access the application:**

    - The **frontend** will be available at `http://localhost:8080`.
    - The **backend** server will be running on port `3000`.

## Project Structure

```
alarms/
├── backend/      # Node.js backend application
└── frontend/     # React frontend application
```

##

For more detailed information on each part of the system, please refer to the `README.md` files within the `backend` and `frontend` directories.
