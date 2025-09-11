# Alarm System Frontend

This frontend is a modern, responsive dashboard built with **React**, **Vite**, and **TypeScript**, and styled using **Tailwind CSS**. It provides an intuitive interface for monitoring and managing the alarm system in real-time.

## Features

- **Real-Time Dashboard**: Utilizes a WebSocket connection to receive live updates on alarm statuses, ensuring the UI is always current without needing to refresh the page.
- **Interactive UI Components**: A suite of custom components, including summaries, active alarm lists, and collapsible room lists, for a seamless user experience.
- **Alarm Deactivation**: Users can deactivate alarms directly from the dashboard. For rooms, a modal prompts for a reason, which is logged on the backend.
- **Detailed Views**: A modal provides detailed information about each room, including its status, last activation time, and other relevant data.
- **Dark/Light Theme**: Includes a theme toggle for switching between light and dark modes, with the user's preference saved in local storage.
- **Browser Notifications**: Leverages the browser's Notification API to alert users of new alarms, even if the application is not in the foreground.

## Tech Stack

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Docker** and **Docker Compose** for containerization.

## Getting Started

To run the frontend service independently, you will need Node.js and npm installed.

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
    This will start the Vite development server, and the application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production.
- `npm run lint`: Lints the codebase for errors and style inconsistencies.
- `npm run preview`: Serves the production build locally for testing.

## Project Structure

```
src/
├── assets/         # Static assets like images and iconsù
├── components      # Reusable React components
│   ├── icons/      # SVG icon components
│   ├── Accordion.tsx
│   ├── ActiveAlarms.tsx
│   ├── DeactivationAlarmModal.tsx
│   ├── Header.tsx
│   ├── RoomCard.tsx
│   ├── RoomDetailsModal.tsx
│   ├── RoomList.tsx
│   └── Summary.tsx
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
├── index.css       # Global styles and Tailwind CSS configuration
└── types.ts        # TypeScript type definitions for the frontend
```