const bcrypt = require('bcryptjs');
const UserRepository = require('../../data/models/UserRepository');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(username, password) {
        // Validaciones de negocio
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const user = await this.userRepository.create({ username, password });
        return { id: user.id, username: user.username };
    }

    async login(username, password) {
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const user = await this.userRepository.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        return { id: user.id, username: user.username };
    }
}

module.exports = AuthService; 