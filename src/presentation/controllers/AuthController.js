const AuthService = require('../../business/services/AuthService');

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    async register(req, res) {
        try {
            const { username, password } = req.body;
            const user = await this.authService.register(username, password);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await this.authService.login(username, password);
            
            req.session.userId = user.id;
            req.session.username = user.username;
            
            res.json({ message: 'Logged in successfully' });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    logout(req, res) {
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    }
}

module.exports = AuthController; 