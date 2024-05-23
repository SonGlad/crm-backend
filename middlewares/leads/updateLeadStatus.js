const { HttpError } = require("../../helpers/index");
const { Office1Schemas, Office1Leads }  = require("../../models/Office1Leads");
const { Office2Schemas, Office2Leads }  = require("../../models/Office2Leads");
const validateBody = require("../validateBody");


const updateLeadStatus = async (req, res, next) => {
    const { branch: authBranch } = req.auth;
    const { leadId } = req.params;


    let schema;
    let lead;


    switch(authBranch){
        case "Main":
            lead = await Office1Leads.findOne({_id: leadId})
            if (!lead) {
                lead = await Office2Leads.findOne({_id: leadId})
            }

            if (!lead || !lead.branch) {
                return next(HttpError(404, "Lead not found or branch not specified in lead"));
            }

            switch(lead.branch){
                case "Office1":
                    schema = Office1Schemas.office1UpdateLeadStatus;
                    break;
                case "Office2":
                    schema = Office2Schemas.office2UpdateLeadStatus;
                    break;
                default: 
                    return next(HttpError(400, "Invalid branch provided in lead"));
            };
            break;
        case "Office1":
            schema = Office1Schemas.office1UpdateLeadStatus;
            break;
        case "Office2":
            schema = Office2Schemas.office2UpdateLeadStatus;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided in auth token"));
    };


    validateBody(schema)(req, res, next);
};


module.exports = updateLeadStatus;