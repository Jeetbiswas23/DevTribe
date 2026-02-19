import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';

import { initSocket } from './socket.js';
import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import teamRoutes from './routes/teams.js';
import hackathonRoutes from './routes/hackathons.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();


// ✅ Connect Database
connectDB();


// ✅ Create express app
const app = express();


// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);


// ✅ PORT
const PORT = process.env.PORT || 5000;



// ✅ Initialize Socket.IO
initSocket(server);



// ✅ Allowed Frontend Origins ONLY
const allowedOrigins = [

  "http://localhost:5173",

  "https://dev-tribe.vercel.app"

];



// ✅ CORS Configuration
const corsOptions = {

  origin: function (origin, callback) {

    if (!origin) return callback(null, true);


    if (allowedOrigins.includes(origin)) {

      callback(null, true);

    } else {

      console.log("❌ CORS blocked:", origin);

      callback(new Error("Not allowed by CORS"));

    }

  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"]

};



// ✅ Apply CORS
app.use(cors(corsOptions));



// ✅ Handle preflight requests
app.options("*", cors(corsOptions));



// ✅ Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// ✅ Cookie Parser
app.use(cookieParser());



// ✅ Health Route
app.get("/api/health", (req, res) => {

  res.status(200).json({

    status: "ok",

    message: "DevTribe API is running"

  });

});



// ✅ API Routes

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/teams", teamRoutes);

app.use("/api/hackathons", hackathonRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/notifications", notificationRoutes);



// ✅ Root Route
app.get("/", (req, res) => {

  res.json({

    message: "Welcome to DevTribe API"

  });

});



// ✅ Global Error Handler
app.use((err, req, res, next) => {

  console.error("🔥 Error:", err.message);


  res.status(500).json({

    error: err.message || "Server Error"

  });

});



// ✅ Start Server
server.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});



export default app;
