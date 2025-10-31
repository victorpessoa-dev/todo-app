import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { prisma } from './prisma.js';
import { todosRouter } from './routes/todos.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN;

// Middlewares
app.use(cors({
    origin: clientOrigin ? clientOrigin.split(',').map(o => o.trim()) : '*',
}));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/todos', todosRouter);

// Error handling
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
