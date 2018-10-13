const User = require('../../models/User');
const Todo = require('../../models/Todo');

/**
 * Returns the current logged in user's user info
 *
 * @param {Request} req 
 * @param {Response} res 
 */
function me(req, res) {

    // get the user by id, but omit their password
    User.findById(req.userId, { password: false }, function (err, user) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem finding the user."
            });
        }
        
        if (!user) {
            return res.status(404).send({
                message: "No user with ID " + req.userId + " was found."
            });
        }

        res.status(200).send({
            message: "Request successful",
            response: user
        });
    });
}

/**
 * Lists all the Users in the system
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function list(req, res) {

    User.find({}, function (err, users) {

        if (err) {
            return res.status(500).send("There was an error getting the list of users.");
        }

        res.status(200).send({
            message: "Request successful",
            response: users
        });
    });
}

/**
 * Retrieves an individual User with the given ID
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function details(req, res) {

    // get the user by id, but omit their password
    User.findById(req.params.id, { password: false }, function (err, user) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem finding the user."
            });
        }
        
        if (!user) {
            return res.status(404).send({
                message: "No user with ID " + req.params.id + " was found."
            });
        }

        res.status(200).send({
            message: "Request successful",
            response: user
        });
    });
}

/**
 * Replaces an existing User's data
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function replace(req, res) {

    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        
        if (err) { 
            return res.status(500).send({
                message: "There was a problem updating the user."
            });
        }

        res.status(200).send({
            message: "User was successfully updated.",
            response: user
        });
    });
}

/**
 * Deletes a User
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function remove(req, res) {

    var userData = null;

    const removeTodo = Todo.deleteMany({user: { _id: req.params.id}});
    const removeUser = User.findByIdAndDelete(req.params.id, function(err, user) {
        userData = user;
    })

    Promise.all([removeTodo, removeUser]).then(result => {
            
        res.status(200).json({
            message: 'User was successfully deleted.',
            response: userData
        });

    }).catch(err => {

        if (err) { 
            return res.status(500).send({
                message: "There was a problem deleting the user and removing their todos. " + err
            });
        }
    });
}

module.exports = {
    list: list,
    me: me,
    details: details,
    replace: replace,
    delete: remove
};