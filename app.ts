import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import config from './config';
import authRoutes from './routes/api/auth';
import registerRoutes from './routes/api/register';

export const authRoute = '/api/auth/';
export const registerRoute = '/api/register/';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

mongoose
    .connect(config.ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(registerRoute, registerRoutes);
app.use(authRoute, authRoutes);

export default app;
