import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // ✅ required to define __dirname
import { connectDB } from './config/db.js';
import colors from 'colors';

import userRouter from './routes/DeliveryUserRoute.js';
import addAccountRouter from './routes/AddAccountRoutes.js';

// ✅ Define __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to React build
const buildPath = path.join(__dirname, '../client/build');

// App setup
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/images', express.static('uploads'));
app.use(express.static(buildPath)); // ✅ serve frontend

// DB connection
connectDB();

// API routes
app.use('/api/deliveryUser', userRouter);
app.use('/api/account', addAccountRouter);

// ✅ Catch-all route for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`.bgCyan.white);
});
