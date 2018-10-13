const config = require('../../config/environment');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Creates a new User with their password encrypted and essentially goes ahead and logs them in by 
 * returning a JWT for them.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function signup(req, res) {

    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    },
    function (err, user) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem registering the user. " + err
            });
        }

        // sign the JWT with our secret and make it valid for 24 hours
        var token = jwt.sign({ id: user._id }, config.jwtSecret, {
            expiresIn: 86400
        });

        res.status(201).send({
            message: "User was successfully registered.",
            response: {
                token: token,
                user: user
            },
        });
    });
}

/**
 * Takes an email address and a password from a user, looks them up in the DB, and
 * compares their stored hashed password to the one they sent.  If it's good, give
 * them a new signed JWT.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function login(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem looking up the user."
            });
        }

        if (!bcrypt.compare(user.password, req.body.password)) {
            return res.status(401).send({
                message: "Login failed."
            });
        }

        // sign the JWT with our secret and make it valid for 24 hours
        var token = jwt.sign({ id: user._id }, config.jwtSecret, {
            expiresIn: 86400
        });

        res.status(200).send({
            message: "Login successful.",
            response: {
                token: token
            },
        });
    });
}

module.exports = {
    signup: signup,
    login: login
};