const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded; // Attach decoded user data to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = authenticate;
