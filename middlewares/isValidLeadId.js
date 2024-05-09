const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers/index");


const isValidLeadId = (req, res, next) => {
    const { leadId } = req.params;


    if(!isValidObjectId(leadId)) {
        return next(HttpError(400, `${leadId} is not valid id`))
    };


    next();
}; 


module.exports =  isValidLeadId;