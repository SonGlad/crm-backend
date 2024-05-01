const { Office1Leads} = require("../../models/Office1Leads");
const { Office2Leads} = require("../../models/Office2Leads");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const leadAssign = async (req, res) => {
    const { name, lastName, email, phone, resource, branch } = req.body;
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let existingLead;
    let newLead;


    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    existingLead = await Office1Leads.findOne({email});
                    break;
                case "Office2":
                    existingLead = await Office2Leads.findOne({email});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' });   
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if (existingLead) {
        throw HttpError(400, "Such Lead already exists" );
    };


    switch(branch){
        case "Office1":
            newLead = await Office1Leads.create({ name, lastName, email, phone, resource, branch});
            break;
        case "Office2":
            newLead = await Office2Leads.create({ name, lastName, email, phone, resource, branch });
            break;
        default:
            return res.status(400).send({ message: 'Invalid branch specified' });  
    };


    res.status(201).send(newLead);
};


module.exports = { 
    leadAssign: ctrlWrapper(leadAssign)
};