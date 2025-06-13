const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const TaskController = require('./presentation/controllers/TaskController');
const AuthController = require('./presentation/controllers/AuthController');

const app = express();
const taskController = new TaskController();
const authController = new AuthController();

// Middleware
app.use(express.static(path.join(__dirname, 'presentation/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Routes
app.get('/', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html');
    }
    res.redirect('/dashboard.html');
});

// Auth Routes
app.post('/api/register', (req, res) => authController.register(req, res));
app.post('/api/login', (req, res) => authController.login(req, res));
app.get('/api/logout', (req, res) => authController.logout(req, res));

// Task Routes
app.get('/api/tasks', (req, res) => taskController.getTasks(req, res));
app.post('/api/tasks', (req, res) => taskController.createTask(req, res));
app.put('/api/tasks/:id', (req, res) => taskController.updateTaskStatus(req, res));
app.delete('/api/tasks/:id', (req, res) => taskController.deleteTask(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 