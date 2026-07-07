# Quick Task - Task Management Application

This is a modern, responsive task management application built with Next.js and Tailwind CSS. It allows users to manage their tasks through a Kanban-style board with "To Do", "In Progress", and "Done" lanes.

## Features

- **User Authentication**: Secure login and registration system using JWT.
- **Task Management**: Create, move, and delete tasks.
- **Kanban Board**: Visualize tasks in different stages of completion.
- **Freemium Model**: Free users can create up to 3 tasks.
- **Premium Tier**: Users can upgrade via Stripe to unlock unlimited tasks.
- **Responsive UI**: A clean and modern interface that works on all screen sizes.
- **Toast Notifications**: Provides feedback for user actions like creating or deleting tasks.

---

## Local Setup and Run Instructions

Follow these steps to get the project running on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/Rakibislam22/QuickTask
cd QuickTask
```

### 2. Install dependencies

Install the required packages using npm or your preferred package manager:

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of your project by copying the example file:

```bash
cp .env.example .env.local
```

Now, open `.env.local` and fill in the required environment variables.

### 4. Run the development server

Start the Next.js development server:

```bash
npm run dev
```

The application should now be running at http://localhost:3000.

---

## `.env.example`

This file contains the environment variables needed to run the application.

```env
# The base URL for the backend API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Your Stripe publishable key for handling payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Implementation Notes & Challenges

- **Architecture**: The frontend is built with Next.js (App Router) and communicates with a separate backend API for data persistence and authentication.
- **State Management**: Client-side state is managed primarily with React hooks (`useState`, `useEffect`, `useRef`). For a larger application, integrating a dedicated state management library like Zustand or React Query could be beneficial.
- **Component Structure**: Initially, the dashboard was a single large component. A key challenge was refactoring it into smaller, reusable components (Modals, UserMenu, etc.) located in `src/lib/` to improve maintainability and code clarity.
- **Error Handling**: A centralized function, `getApiErrorMessage`, was created in `src/lib/utils.ts` to handle API errors consistently across the application, providing clear feedback to the user via toast notifications. This was crucial for creating a reliable user experience.
- **Authentication**: The authentication flow relies on JWTs stored in `localStorage`. An Axios interceptor is used to automatically attach the bearer token to all outgoing API requests, simplifying API calls throughout the app.
