var mongoose = require('mongoose');

function validateObjectId(req, res, next) {

    var id = req.params.id;
  
    if (id) {
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
        
            return res.status(422).send({
                message: 'Invalid object ID provided.'
            });
        }
    }

    next();
}

module.exports = validateObjectId;