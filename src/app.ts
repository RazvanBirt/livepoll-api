
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import routes from './routes/index';
import jwt from 'jsonwebtoken';

const app = express();

const server = http.createServer(app); // Create raw HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // adjust for production
  },
});

app.set('io', io);

app.use(cors());
app.use(express.json());

// ✅ Log every route request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use('/api', routes); // All routes now under /api/*

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    console.warn('Socket connection rejected: No token provided');
    return next(new Error('Unauthorized: No token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    socket.data.user = decoded; // store user info for later
    return next();
  } catch (err) {
    console.warn('Socket connection rejected: Invalid token');
    return next(new Error('Unauthorized: Invalid token'));
  }
});


// Socket.IO handlers
io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`✅ Socket connected: ${socket.id} as ${user?.email}`);

  socket.on('poll:join', (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`🔔 User ${user?.email} joined room poll-${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
