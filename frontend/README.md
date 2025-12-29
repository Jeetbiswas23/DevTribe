# DevTribe Frontend

Modern React + Vite frontend for the DevTribe platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── Features.jsx
│   │   ├── Hero.jsx
│   │   └── Navbar.jsx
│   ├── pages/              # Page components
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Hackathons.jsx
│   │   └── ...
│   ├── lib/                # Utility functions
│   ├── App.jsx             # Main app component & routing
│   ├── main.jsx            # Entry point
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── index.html
└── vite.config.js
```

## Features

- ⚡ Vite for blazing fast development
- ⚛️ React 18 with React Router v6
- 🎨 Tailwind CSS for styling
- 📱 Fully responsive design
- 🎯 Protected routes with authentication
- 💬 Real-time chat with WebRTC support
- 🏆 Hackathon management
- 👥 Team collaboration tools
- 📊 Judge & HR dashboards

## Tech Stack

- **React** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Monaco Editor** - Code editor for coding rounds
- **LocalStorage** - Client-side data persistence (for demo)

## Development

The app uses React Router for navigation with protected routes. Most state is managed with React hooks and localStorage (as a demo backend).

For production, connect to the backend API by updating the API endpoints in the components.
