const { Leads } = require("../../models/externalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper } = require("../../helpers/index");


const getAll = async (req, res) => {
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;
    const { branch } = req.body;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    let result;


    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    result = await Office1Leads.find().skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                case "Office2":
                    result = await Office2Leads.find().skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                default: 
                    result = await Leads.find().skip(parseInt(skip)).limit(parseInt(limit));
            };
            break;
        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    result = await Office1Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                case "Conversion Manager":
                    result = await Office1Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                case "Conversion Agent":
                    result = await Office1Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                default:
                    return res.status(400).send({ message: 'Authorization role is invalid' });
            };
            break;
        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    result = await Office2Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                case "Conversion Manager":
                    result = await Office2Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                case "Conversion Agent":
                    result = await Office2Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip)).limit(parseInt(limit));
                    break;
                default:
                    return res.status(400).send({ message: 'Authorization role is invalid' });
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    res.status(200).send(result);
};



module.exports = { 
    getAll: ctrlWrapper(getAll)
};
