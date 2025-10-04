import express from 'express';
import dotenv from 'dotenv';
import connect from './config/db.js';
import articlesRoutes from './routes/articles.js';

dotenv.config();
connect();

const app = express();
app.use(express.json());

app.use('/articles', articlesRoutes);

app.listen(process.env.PORT || 4000, () => console.log('Server running'));
