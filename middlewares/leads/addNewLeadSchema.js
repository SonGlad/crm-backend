const { HttpError } = require("../../helpers/index");
const { externalLeadsSchemas }  = require("../../models/externalLead");
const { Office1Schemas }  = require("../../models/Office1Leads");
const { Office2Schemas }  = require("../../models/Office2Leads");
const validateBody = require("../validateBody");


const addNewLeadSchema = async (req, res, next) => {
    const { branch: authBranch } = req.auth;
    const { branch: reqBranch } = req.body;


    let schema;


    switch(authBranch){
        case "Main":
            switch(reqBranch){
                case "Office1":
                    schema = Office1Schemas.addOffice1LeadSchema;
                    break;
                case "Office2":
                    schema = Office2Schemas.addOffice2LeadSchema;
                    break;
                default:
                    schema = externalLeadsSchemas.addExternalLeadSchema
            };
            break;
        case "Office1":
            schema = Office1Schemas.addOffice1LeadSchema;
            break;
        case "Office2":
            schema = Office2Schemas.addOffice2LeadSchema;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided in auth token"));
    };


    validateBody(schema)(req, res, next);
};


module.exports = addNewLeadSchema;



