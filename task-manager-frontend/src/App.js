import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://task-manager-app-w0cs.onrender.com'; // Replace with your Render backend URL

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState({ title: '', description: '', status: 'To Do', priority: 'Low' });
    const [editingTask, setEditingTask] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const handleSubmit = async () => {
        if (!task.title || !task.status) {
            alert('Title and status are required');
            return;
        }

        try {
            if (editingTask) {
                await axios.put(`${API_URL}/tasks/${editingTask.id}`, task);
                setEditingTask(null);
            } else {
                await axios.post(`${API_URL}/tasks`, task);
            }
            setTask({ title: '', description: '', status: 'To Do', priority: 'Low' });
            fetchTasks();
        } catch (err) {
            console.error('Error saving task:', err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    return (
        <div className="app-container">
            <div className="gradient"></div> {/* Gradient background */}
            <header className="navbar">
                <h1>Blocky Task Manager</h1>
            </header>

            <section className="hero">
                <div className="content">
                    <h2>Welcome to Blocky Task Manager</h2>
                    <p>Organize your tasks like a pro miner!</p>
                    <div className="today">{currentDate}</div>
                    <button className="cta-button">Get Started</button>
                </div>
            </section>

            <div className="task-manager">
                <div className="task-form">
                    <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                    />
                    <select
                        value={task.status}
                        onChange={(e) => setTask({ ...task, status: e.target.value })}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <select
                        value={task.priority}
                        onChange={(e) => setTask({ ...task, priority: e.target.value })}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button onClick={handleSubmit}>
                        {editingTask ? 'Save Changes' : 'Add Task'}
                    </button>
                    {editingTask && (
                        <button onClick={() => setEditingTask(null)}>Cancel</button>
                    )}
                </div>

                <div className="task-list">
                    {tasks.map((task) => {
                        console.log(task);  // Debugging log
                        return (
                            <div key={task.id} className="task-item">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <p>Status: {task.status}</p>
                                <p>Priority: <span className={`priority-${(task.priority || 'low').toLowerCase()}`}>{task.priority}</span></p>
                                <div className="task-buttons">
                                    <button onClick={() => setEditingTask(task)}>Edit</button>
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <footer className="footer">
                <h4>Follow Us</h4>
                <div className="social-icons">
                    <a href="https://facebook.com">Facebook</a>
                    <a href="https://twitter.com">Twitter</a>
                    <a href="https://linkedin.com">LinkedIn</a>
                </div>
                <p>
                    © 2023 Blocky Task Manager. Built with ❤️ by Asha Mweene. 
                    <br />
                    Tech Stack: React, CSS, Axios, Node.js, Express, PostgreSQL. 
                    <br />
                    "Because who needs sleep when you have tasks to manage?"
                </p>
                <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    ↑ Back to Top
                </button>
            </footer>
        </div>
    );
};

export default App;