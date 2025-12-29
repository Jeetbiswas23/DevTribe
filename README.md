# DevTribe

A modern developer community platform for hackathon teams and collaboration.

## Project Structure

```
devtribe/
├── frontend/          # React + Vite frontend
└── backend/           # Node.js + Express backend
```

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on http://localhost:5000

## Features

- 🏆 **Hackathon Management** - Browse, create, and join hackathons
- 👥 **Team Formation** - Find teammates with specific skills
- 💬 **Real-time Chat** - WebRTC-powered audio/video calls
- 📊 **Judge Portal** - Evaluate submissions and provide feedback
- 💼 **HR Dashboard** - Recruit talent from hackathon participants
- 🎯 **Contest Rounds** - MCQ and coding challenges with Monaco editor
- 📱 **Responsive Design** - Mobile-first, beautiful UI

## Tech Stack

### Frontend

- React 18
- Vite
- React Router v6
- Tailwind CSS
- Monaco Editor
- WebRTC

### Backend

- Node.js
- Express
- Socket.io (for real-time features)
- MongoDB (planned)
- JWT Authentication (planned)

## Development

Both frontend and backend are set up for hot-reload development.

For production deployment:

1. Build frontend: `cd frontend && npm run build`
2. Serve static files from backend
3. Configure environment variables

## Contributing

This is a hackathon project. Feel free to fork and improve!

## License

MIT
