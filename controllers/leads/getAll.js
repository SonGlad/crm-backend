const { Leads } = require("../../models/externalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper } = require("../../helpers/index");


const getAll = async (req, res) => {
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;
    const { branch, page, limit } = req.query;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    const skip = (page - 1) * limit;
    let result;
    let allLeads;
    let totalPages;


    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    allLeads = (await Office1Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office1Leads.find()
                    .skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'managerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                case "Office2":
                    allLeads = (await Office2Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office2Leads.find()
                    .skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'managerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                default: 
                    allLeads = (await Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Leads.find().skip(parseInt(skip)).limit(parseInt(limit));
            };
        break;


        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    allLeads = (await Office1Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office1Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    }).skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                case "Conversion Manager":
                    allLeads = (await Office1Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office1Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                case "Conversion Agent":
                    allLeads = (await Office1Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
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
                    allLeads = (await Office2Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office2Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    }).skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                case "Conversion Manager":
                    allLeads = (await Office2Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
                    result = await Office2Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    }).skip(parseInt(skip))
                    .limit(parseInt(limit))
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                break;


                case "Conversion Agent":
                    allLeads = (await Office2Leads.find()).length;                 
                    totalPages = Math.ceil(allLeads / limit);
                    if (!totalPages) {
                        totalPages = 1
                    }
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


    res.status(200).send({totalPages, result});
};



module.exports = { 
    getAll: ctrlWrapper(getAll)
};
