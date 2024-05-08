const { HttpError } = require("../../helpers/index");
const { Office1Schemas }  = require("../../models/Office1Leads");
const { Office2Schemas }  = require("../../models/Office2Leads");
const validateBody = require("../validateBody");


const validOfficeAssignedSchema = async (req, res, next) => {
    const { branch: authBranch, role: authRole } = req.auth;
    const { branch: reqBranch } = req.body;


    let schema1;
 

    switch(authBranch){
        case 'Main':
            switch(reqBranch){
                case 'Office1':
                    schema1 = Office1Schemas.addOffice1LeadSchema;
                    break;
                case 'Office2':
                    schema1 = Office2Schemas.addOffice2LeadSchema;
                    break;
                default:
                    return next(HttpError(400, "Invalid branch provided"));
            };
            break;
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    schema1 = Office1Schemas.office1ConManagerSchema;
                    break;
                case "Conversion Manager":
                    schema1 = Office1Schemas.office1ConAgentSchema;
                    break;
                default:
                    return next(HttpError(400, "Invalid branch provided"));
            };
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    schema1 = Office2Schemas.office2ConManagerSchema;
                    break;
                case "Conversion Manager":
                    schema1 = Office2Schemas.office2ConAgentSchema;
                    break;
                default:
                    return next(HttpError(400, "Invalid branch provided"));
            };
            break;
        default:
            return next(HttpError(400, "Invalid branch provided in auth token"));
    };


    validateBody(schema1)(req, res, next);
};


module.exports = validOfficeAssignedSchema;