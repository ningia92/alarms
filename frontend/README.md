# Alarm System Frontend

This frontend is a modern, responsive dashboard built with **React**, **Vite**, and **TypeScript**, and styled using **Tailwind CSS**. It provides an intuitive interface for monitoring and managing the alarm system in real-time.

## Features

-   **Real-Time Dashboard**: Utilizes a WebSocket connection to the backend (`ws://SERVER_IP:SERVER_PORT`) to receive live updates on alarm statuses (`alarm_on`, `alarm_down`, `room_list`). The UI updates instantly without requiring a page refresh. It also includes a robust reconnection mechanism that attempts to re-establish the connection every 3 seconds if it's lost.
-   **Interactive UI Components**: The interface is composed of several key components:
    -   **`Summary`**: Displays high-level statistics, including the total number of rooms, active alarms, safe rooms, and unreachable devices.
    -   **`ActiveAlarms`**: A dedicated section that lists all currently active alarms, sorted by the most recent, allowing for quick identification and action.
    -   **`RoomList`**: Organizes all rooms by block (1, 2, 3, 4) within collapsible accordion sections. Each room is represented by a `RoomCard`.
-   **Alarm Management**: Users can deactivate alarms directly from the dashboard.
    -   The `DeactivationAlarmModal` prompts for a reason before deactivating a room alarm, ensuring all actions are logged.
    -   A `RoomDetailsModal` provides a comprehensive view of each room's details, including ID, block, phone number, and alarm status.
-   **Dark/Light Theme**: Includes a theme toggle in the header. The user's preference is saved in `localStorage` and applied on subsequent visits, with a script in `index.html` to prevent the "flash of unstyled content" (FOUC).
-   **Browser Notifications**: Leverages the browser's Notification API to alert users of new alarms with a desktop notification, even if the application is not in the foreground.

## Tech Stack

-   **React 19**
-   **Vite**
-   **TypeScript**
-   **Tailwind CSS**
-   **Docker & Docker Compose** (for containerization with Nginx)
-   **ESLint** for code linting

## Getting Started

To run the frontend service locally, you will need Node.js and npm installed.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server. The application will be available at the address shown in your terminal (usually `http://localhost:5173`).

## Available Scripts

-   `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
-   `npm run build`: Bundles the application for production. The output is placed in the `dist` directory.
-   `npm run lint`: Lints the codebase for errors and style inconsistencies using ESLint.
-   `npm run preview`: Serves the production build locally to test it before deployment.

## Docker Deployment

The application is containerized for easy and consistent deployment.

-   The `Dockerfile` uses a multi-stage build. The first stage builds the React application, and the second stage copies the static build files into a lightweight **Nginx** server image.
-   The `docker-compose.yml` file defines the service to build and run the container, exposing the application on port **8080**.

To deploy using Docker:
```bash
docker compose up
```
Some useful options for the ``` docker compose up ``` command:
```
Options:
-f, -file stringArray      Specify an alternate environment file
-d, --detach               Run container in background and print container ID
--build                    Build images before starting containers (use it when you have to rebuild the image)
```