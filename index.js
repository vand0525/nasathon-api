import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connect from './config/db.js';
import articlesRoutes from './routes/articles.js';

connect();

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/articles', articlesRoutes);

app.listen(process.env.PORT || 4000, () => console.log('Server running'));
