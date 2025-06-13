const fs = require('fs').promises;
const path = require('path');

class TaskRepository {
    constructor() {
        this.dataPath = path.join(__dirname, '../../../data/tasks.json');
    }

    async readTasks() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.writeTasks([]);
                return [];
            }
            throw error;
        }
    }

    async writeTasks(tasks) {
        await fs.writeFile(this.dataPath, JSON.stringify(tasks, null, 2));
    }

    async findAll() {
        return await this.readTasks();
    }

    async findById(id) {
        const tasks = await this.readTasks();
        return tasks.find(task => task.id === id);
    }

    async create(taskData) {
        const tasks = await this.readTasks();
        const newTask = {
            id: Date.now().toString(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        await this.writeTasks(tasks);
        return newTask;
    }

    async update(id, taskData) {
        const tasks = await this.readTasks();
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return null;

        tasks[index] = { ...tasks[index], ...taskData };
        await this.writeTasks(tasks);
        return tasks[index];
    }

    async delete(id) {
        const tasks = await this.readTasks();
        const index = tasks.findIndex(task => task.id === id);
        if (index === -1) return false;

        tasks.splice(index, 1);
        await this.writeTasks(tasks);
        return true;
    }
}

module.exports = TaskRepository; 