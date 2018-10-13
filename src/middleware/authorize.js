var jwt = require('jsonwebtoken');
var config = require('../config/environment');

function authorize(req, res, next) {

    var token = req.headers['authorization'];
  
    if (!token) {
        return res.status(403).send({
            message: 'Missing authorization header.'
        });
    }
  
    jwt.verify(token, config.jwtSecret, function(err, decodedToken) {
        
        if (err) {
            return res.status(500).send({
                message: 'Invalid authorization header.'
            });
        }
    
        // If the token is valid, add the userId to the request so
        // that we can fetch only the data pertinent to the user
        req.userId = decodedToken.id;

        next();
    });
}

module.exports = authorize;