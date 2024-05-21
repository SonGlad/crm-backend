const { HttpError } = require("../../helpers/index");
const { externalLeadsSchemas }  = require("../../models/ExternalLead");
const { Office1Schemas }  = require("../../models/Office1Leads");
const { Office2Schemas }  = require("../../models/Office2Leads");
const validateBody = require("../validateBody");


const chnageBaseInfoSchema = async (req, res, next) => {
    const { branch: authBranch } = req.auth;


    let schema;


    switch(authBranch){
        case "Main":
            schema = externalLeadsSchemas.changeBaseInfoSchema
            break;
        case "Office1":
            schema = Office1Schemas.office1ChnageBaseInfoSchema;
            break;
        case "Office2":
            schema = Office2Schemas.office2ChnageBaseInfoSchema;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided in auth token"));
    };


    validateBody(schema)(req, res, next);
};


module.exports = chnageBaseInfoSchema;