import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  },
  connectionStateRecovery: {}
});

if (process.env.NODE_ENV !== 'production') {
  io.listen(5173)
}

const __dirname = dirname(fileURLToPath(import.meta.url));


// Serve static files from the React app
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(join(__dirname)));
//   app.get('*', (req, res) => {
//     res.sendFile(join(__dirname, 'dist', 'index.html')); // Ensure 'index.html' is a string
//   });
// }

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile('index.html'); // Ensure 'index.html' is a string
  });
}

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test successful' });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('playSound', (sample) => {
    console.log('Received playSound event');
    socket.broadcast.emit('playSound', sample);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
