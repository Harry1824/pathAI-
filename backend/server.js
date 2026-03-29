import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import User from './models/User.js';

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/campuspath')
  .then(async () => {
    console.log('Connected to Local MongoDB: campuspath');
    
    // Seed admin user if it doesn't exist
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        name: 'Campus Admin'
      });
      console.log('Seeded default admin user (admin/admin123)');
    }
  })
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('CampusPath AI Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
