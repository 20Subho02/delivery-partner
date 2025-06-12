import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // For ES Module __dirname
import { connectDB } from './config/db.js';
import colors from 'colors';
import userRouter from './routes/DeliveryUserRoute.js';
import addAccountRouter from './routes/AddAccountRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend build
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// DB
connectDB();

// API routes
app.use('/api/deliveryUser', userRouter);
app.use('/images', express.static('uploads'));
app.use('/api/account', addAccountRouter);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('API Working...');
});

// CATCH-ALL: Serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`.bgCyan.white)
);
