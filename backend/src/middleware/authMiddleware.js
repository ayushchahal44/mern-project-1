const jwt = require('jsonwebtoken');

const authMiddleware = {
    protect: async (request, response, next) => {
        try {
            const token = request.cookies?.jwtToken;
            if (!token) {
                return response.status(401)
                    .json({ error: 'Not Authorized'});
            }

            const user = jwt.verify(token, process.env.JWT_SECRET);
            request.user = user;
            next();
        } catch (error) {
            console.log(error);
            return response.status(500)
                .json({ error: 'Internal server error'});
        }
    },
};

module.exports = authMiddleware;