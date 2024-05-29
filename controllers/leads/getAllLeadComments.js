const {HttpError, ctrlWrapper} = require("../../helpers/index");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { AllCommentsSchema } = require("../../models/LeadsComments");


const getAllLeadComments = async (req, res) => {
    const { leadId } = req.params;
    const {role: userRole, branch: userBranch,} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

  
    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };

    
    let lead;
    let leadComments;


    switch(authBranch){
        case "Main":
            lead = await Office1Leads.findOne({_id: leadId});
            if(!lead){
                lead = await Office2Leads.findOne({_id: leadId})
            }
            if(!lead || !lead.branch){
                return res.status(400).send({ message: "Lead not found or branch not specified in lead"});
            }
            switch(lead.branch){
                case "Office1":
                    leadComments = await AllCommentsSchema.find({
                        ownerLeadId_office1: leadId
                    })
                    .select('-ownerLeadId_office1 -updatedAt')
                    .sort({ createdAt: 1 })
                    break;
                case "Office2":
                    leadComments = await AllCommentsSchema.find({
                        ownerLeadId_office2: leadId
                    })
                    .select('-ownerLeadId_office2 -updatedAt')
                    .sort({ createdAt: 1 })
                    break;
                default:
                    return res.status(400).send({ message: "Lead branch not specified in lead"});
            };
            break;
        case "Office1":
            leadComments = await AllCommentsSchema.find({
                ownerLeadId_office1: leadId
            })
            .select('-ownerLeadId_office1 -updatedAt')
            .sort({ createdAt: 1 })
            break;
        case "Office2":
            leadComments = await AllCommentsSchema.find({
                ownerLeadId_office2: leadId
            })
            .select('-ownerLeadId_office2 -updatedAt')
            .sort({ createdAt: 1 })
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if (!leadComments || leadComments.length === 0) {
        throw HttpError(404, "No comments were found for the current lead");
    };


    res.status(200).send(leadComments);
};


module.exports = {
    getAllLeadComments: ctrlWrapper(getAllLeadComments)
};