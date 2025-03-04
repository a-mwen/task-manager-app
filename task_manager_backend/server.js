require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Routes

// GET /tasks - Fetch all tasks
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        const tasks = result.rows.map(task => ({
            id: Number(task.id), // Ensure ID is a number
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
        }));
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /tasks - Create a new task
app.post('/tasks', async (req, res) => {
    const { title, description, status, priority } = req.body;
    if (!title || !status || !priority) {
        return res.status(400).json({ error: 'Title, status, and priority are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, status, priority]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', async (req, res) => {
    const { title, description, status, priority } = req.body;
    const taskId = parseInt(req.params.id, 10);

    if (!title || !status || !priority) {
        return res.status(400).json({ error: 'Title, status, and priority are required' });
    }

    try {
        const checkTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (checkTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4 WHERE id = $5 RETURNING *',
            [title, description, status, priority, taskId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
        const checkTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
        if (checkTask.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});