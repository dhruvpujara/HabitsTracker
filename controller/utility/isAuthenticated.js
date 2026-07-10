const jsonwebtoken = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {

        if (!req.cookies.user) {
            return res.redirect('/login');
        } else {
            const token = req.cookies.user;
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            req.user = decoded
            next();
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        console.error('Error verifying token:', error);
    }

}

module.exports = { isAuthenticated };