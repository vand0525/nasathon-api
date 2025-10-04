import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connect from './config/db.js';
import articlesRoutes from './routes/articles.js';

connect();

const app = express();
app.use(express.json());

app.use('/articles', articlesRoutes);

app.listen(process.env.PORT || 4000, () => console.log('Server running'));
