// backend/index.js

import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';

// --- ADD THESE THREE LINES to handle paths correctly with ES Modules ---
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- ROUTE IMPORTS ---
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // <-- THIS LINE WAS MISSING
import productRoutes from './routes/productRoutes.js';

// --- MIDDLEWARE IMPORTS ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Initialize ---
dotenv.config();
connectDB();
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- SERVE STATIC FILES ---
// This line makes the 'public' folder accessible from the browser
app.use(express.static(path.join(__dirname, 'public')));

// --- Test API Endpoint ---
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// --- API ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes); // This line will now work correctly
app.use('/api/products', productRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});