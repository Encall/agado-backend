const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtsecretkey = process.env.JWT_SECRET_KEY;

exports.protected = (req, res) => {
    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, jwtsecretkey, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
};
