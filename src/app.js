import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send("API is running...");
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;  