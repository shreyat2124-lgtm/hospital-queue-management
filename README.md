# Cura Healthcare Portal

A modern, responsive healthcare queue management and patient portal application. Cura is designed to streamline hospital operations by providing real-time dashboards for doctors and administrators, and a seamless booking experience for patients.

## Features

- **Patient Portal & Booking:** Patients can browse specialized departments, view doctor profiles, and easily book consultations.
- **Admin Dashboard:** Centralized view of hospital operations, including live department status, staff availability, and recent activity logs.
- **Doctor Dashboard:** Real-time patient queue management, enabling doctors to track active consultations and upcoming appointments.
- **Queue Management (Live):** Dynamic wait time estimation and ticket tracking to ensure an orderly and efficient patient flow.
- **Modern UI:** Built with React, Tailwind CSS, Framer Motion, and Lucide icons for a premium, responsive user experience.

## Project Structure

This project is a full-stack application divided into two main components:

- `/frontend` - The React application (built with Vite and Tailwind CSS).
- `/backend` - The Express API server (with Socket.io for real-time updates and Prisma ORM).

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyat2124-lgtm/hospital-queue-management.git
   cd hospital-queue-management
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   # Configure your .env file
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Tech Stack
- **Frontend:** React, React Router, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express, Socket.io, Prisma, JWT Authentication

## License
&copy; 2026 Cura Healthcare. All rights reserved.
