const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class UserRepository {
    constructor() {
        this.dataPath = path.join(__dirname, '../../../data/users.json');
    }

    async readUsers() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.writeUsers([]);
                return [];
            }
            throw error;
        }
    }

    async writeUsers(users) {
        await fs.writeFile(this.dataPath, JSON.stringify(users, null, 2));
    }

    async findByUsername(username) {
        const users = await this.readUsers();
        return users.find(user => user.username === username);
    }

    async create(userData) {
        const users = await this.readUsers();
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            password: await bcrypt.hash(userData.password, 10)
        };
        users.push(newUser);
        await this.writeUsers(users);
        return newUser;
    }
}

module.exports = UserRepository; 