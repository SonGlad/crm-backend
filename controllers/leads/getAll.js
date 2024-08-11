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
    let filteredLeads;
    let totalFilteredLeads;


    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    allLeads = await Office1Leads.find()
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

                    filteredLeads = allLeads.sort((a, b) => {
                        if (a.newContact === b.newContact) {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                        return a.newContact ? -1 : 1;
                    });

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);

                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                case "Office2":
                    allLeads = await Office2Leads.find()
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

                    filteredLeads = allLeads.sort((a, b) => {
                        if (a.newContact === b.newContact) {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                        return a.newContact ? -1 : 1;
                    });

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);

                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                default: 
                allLeads = await Leads.find()

                filteredLeads = allLeads.sort((a, b) => {
                    if (a.newContact === b.newContact) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return a.newContact ? -1 : 1;
                });

                totalFilteredLeads = filteredLeads.length;
                totalPages = Math.ceil(totalFilteredLeads / limit);

                result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
            };
        break;


        case "Office1":
            switch(authRole){
                case "CRM Manager":
                    allLeads = await Office1Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    })
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    }); 
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                case "Conversion Manager":
                    allLeads = await Office1Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                case "Conversion Agent":
                    allLeads = await Office1Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    });
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                default:
                    return res.status(400).send({ message: 'Authorization role is invalid' });
            };
        break;


        case "Office2":
            switch(authRole){
                case "CRM Manager":
                    allLeads = await Office2Leads.find({
                        $or: [{managerId: authId}, {'owner.id': authId }]
                    })
                    .populate({
                        path: 'conManagerId',
                        select: 'username'
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    }); 
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                case "Conversion Manager":
                    allLeads = await Office2Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                case "Conversion Agent":
                    allLeads = await Office2Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    });
                    
                    filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    totalFilteredLeads = filteredLeads.length;
                    totalPages = Math.ceil(totalFilteredLeads / limit);
    
                    result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
                break;


                default:
                    return res.status(400).send({ message: 'Authorization role is invalid' });
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    res.status(200).send({totalPages, result, totalFilteredLeads});
};



module.exports = { 
    getAll: ctrlWrapper(getAll)
};
