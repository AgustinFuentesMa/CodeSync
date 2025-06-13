const TaskService = require('../../business/services/TaskService');

class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async getTasks(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const tasks = await this.taskService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createTask(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const task = await this.taskService.createTask(req.body, req.session.username);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateTaskStatus(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            const task = await this.taskService.updateTaskStatus(
                req.params.id,
                req.body.status,
                req.session.username
            );
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            await this.taskService.deleteTask(req.params.id, req.session.username);
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            if (error.message === 'Task not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('permiso')) {
                res.status(403).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }
}

module.exports = TaskController; 