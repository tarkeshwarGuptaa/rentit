import 'dotenv/config'; // ← side-effect import: runs dotenv.config() BEFORE any other module loads
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/ApiError.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';


connectDB();
const app = express();


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);


app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is start listing on port ${process.env.PORT}`)
});

export default app;
