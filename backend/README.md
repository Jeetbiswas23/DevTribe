# DevTribe Backend

Backend server for DevTribe platform.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Structure

```
backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── config/             # Configuration files
└── package.json
```

## Features

- User authentication
- Team management
- Hackathon CRUD operations
- WebRTC signaling server
- Real-time notifications
