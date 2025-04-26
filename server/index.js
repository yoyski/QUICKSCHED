import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import scheduleRouter from './routes/scheduleRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("MongoDB connected successfully")})
  .then(() => {
    console.log("✅ MongoDB connected to:", mongoose.connection.name);
  })
  .catch( (err) => {console.log("MongoDB connection failed: " + err)});



// Routes
app.use('/quicksched', scheduleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})