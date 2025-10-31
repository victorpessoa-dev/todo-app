import { Router } from 'express';
import { prisma } from '../prisma.js';

export const todosRouter = Router();

// Create
todosRouter.post('/', async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'title is required' });
        }
        const todo = await prisma.todo.create({ data: { title } });
        res.status(201).json(todo);
    } catch (err) {
        next(err);
    }
});

// Read (all)
todosRouter.get('/', async (_req, res, next) => {
    try {
        const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(todos);
    } catch (err) {
        next(err);
    }
});

// Read (one)
todosRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) return res.status(404).json({ error: 'Not found' });
        res.json(todo);
    } catch (err) {
        next(err);
    }
});

// Update
todosRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const data = {};
        if (typeof title === 'string') data.title = title;
        if (typeof completed === 'boolean') data.completed = completed;

        const updated = await prisma.todo.update({ where: { id }, data });
        res.json(updated);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        next(err);
    }
});

// Delete
todosRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.todo.delete({ where: { id } });
        res.status(204).end();
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Not found' });
        next(err);
    }
});


