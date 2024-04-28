const {isValidObjectId} = require("mongoose");
const { HttpError } = require("../helpers/index");


const isValidUserId = (req, res, next) => {
    const { userId } = req.params;

    if(!isValidObjectId(userId)) {
        return next(HttpError(400, `${userId} is not valid id`))
    };
    
    next();
}; 

module.exports =  isValidUserId;