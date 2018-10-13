const Todo = require('../../models/Todo');

/**
 * Lists all the Todos in the system for the currently logged in user
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function list(req, res) {

    Todo.find({user: { _id: req.userId}}, function (err, todos) {

        if (err) {
            return res.status(500).send("There was an error getting the list of todos. " + err);
        }

        res.status(200).send({
            message: "Request successful",
            response: todos
        });
    })
    .populate('user', {password: false});
}

/**
 * Retrieves an individual Todo with the given ID and logged in user
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function details(req, res) {

    Todo.findOne({_id: req.params.id, user: {_id: req.userId}}, function (err, todo) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem finding the todo. " + err
            });
        }
        
        if (!todo) {
            return res.status(404).send({
                message: "No todo with ID " + req.params.id + " was found."
            });
        }
        
        res.status(200).send({
            message: "Request successful",
            response: todo
        });
    })
    .populate('user', {password: false});
}

/**
 * Creates a new Todo for the logged in user
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function create(req, res) {

    Todo.create({
        text : req.body.text,
        user: {
            _id: req.userId
        }
    }, 
    function (err, todo) {
        
        if (err) {
            return res.status(500).send({
                message: "There was a problem creating your todo. " + err
            });
        }

        todo.populate('user', {password: false}, function(err, todo) { 

            res.status(200).send({
                message: "Todo was successfully created.",
                response: todo
            });
        });
    });
}

/**
 * Replaces an existing Todo's data as long as the current user is the owner
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function replace(req, res) {

    Todo.findOneAndUpdate({_id: req.params.id, user: { _id: req.userId}}, req.body, {new: true}, function (err, todo) {
        
        if (err) { 
            return res.status(500).send({
                message: "There was a problem updating the todo. " + err
            });
        }

        if (!todo) {
            return res.status(404).send({
                message: "No todo with ID " + req.params.id + " was found."
            });
        }
        
        res.status(200).send({
            message: "Todo was successfully updated.",
            response: todo
        });
    })
    .populate('user', {password: false});
}

/**
 * Deletes a Todo that the current logged in user owns
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function remove(req, res) {

    Todo.findOneAndRemove({_id: req.params.id, user: { _id: req.userId}}, function (err, todo) {
    
        if (err) { 
            return res.status(500).send({
                message: "There was a problem deleting the todo. " + err
            });
        }

        if (!todo) {
            return res.status(404).send({
                message: "No todo with ID " + req.params.id + " was found."
            });
        }

        res.status(200).send({
            message: "Todo was successfully deleted.",
            response: todo
        });
    })
    .populate('user', {password: false});
}

module.exports = {
    list: list,
    details: details,
    create: create,
    replace: replace,
    delete: remove
};