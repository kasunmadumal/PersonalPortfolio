import express from 'express';
import cors from 'cors';
import path from 'path';
import { createRoutes } from './routes';
import { MemStorage } from './storage';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Initialize storage
const storage = new MemStorage();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(createRoutes(storage));

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React routing, return all requests to React app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});