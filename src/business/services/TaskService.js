const TaskRepository = require('../../data/models/TaskRepository');

class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async getAllTasks() {
        return await this.taskRepository.findAll();
    }

    async getTaskById(id) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    async createTask(taskData, username) {
        // Validaciones de negocio
        if (!taskData.title || !taskData.description || !taskData.assignedTo) {
            throw new Error('Missing required fields');
        }

        const newTask = {
            ...taskData,
            status: 'pending',
            createdBy: username
        };

        return await this.taskRepository.create(newTask);
    }

    async updateTaskStatus(id, status, username) {
        const task = await this.getTaskById(id);

        // Validaciones de negocio
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        return await this.taskRepository.update(id, { status });
    }

    async deleteTask(id, username) {
        const task = await this.getTaskById(id);

        // Validación de negocio: solo el creador puede eliminar
        if (task.createdBy !== username) {
            throw new Error('No tienes permiso para eliminar esta tarea');
        }

        const success = await this.taskRepository.delete(id);
        if (!success) {
            throw new Error('Failed to delete task');
        }
        return true;
    }
}

module.exports = TaskService; 