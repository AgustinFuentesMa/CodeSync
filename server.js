const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Helper functions
const readJSONFile = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename)));
};

const writeJSONFile = (filename, data) => {
    fs.writeFileSync(
        path.join(__dirname, 'data', filename),
        JSON.stringify(data, null, 2)
    );
};

// Routes
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }
    res.redirect('/dashboard.html');
});

// Auth routes
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile('users.json');

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword
    };

    users.push(newUser);
    writeJSONFile('users.json', users);

    res.json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readJSONFile('users.json');

    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: 'Logged in successfully' });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// Task routes
app.get('/api/tasks', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const tasks = readJSONFile('tasks.json');
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { title, description, assignedTo } = req.body;
    const tasks = readJSONFile('tasks.json');

    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        createdBy: req.session.username,
        assignedTo,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeJSONFile('tasks.json', tasks);

    res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;
    const tasks = readJSONFile('tasks.json');

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], status };
    writeJSONFile('tasks.json', tasks);

    res.json(tasks[taskIndex]);
});

// Nueva ruta para eliminar tareas
app.delete('/api/tasks/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;
    const tasks = readJSONFile('tasks.json');

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Solo permitir que el creador de la tarea la elimine
    if (tasks[taskIndex].createdBy !== req.session.username) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta tarea' });
    }

    tasks.splice(taskIndex, 1);
    writeJSONFile('tasks.json', tasks);

    res.json({ message: 'Task deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 