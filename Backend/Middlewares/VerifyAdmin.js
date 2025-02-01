const jwt = require('jsonwebtoken');

const adminAuthMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token missing, authentication required' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Check if user role is 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        // If role is admin, proceed with the request
        req.user = decoded;
        next();
    });
};

module.exports = adminAuthMiddleware;
