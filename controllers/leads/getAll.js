const { Leads } = require("../../models/externalLead");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { ctrlWrapper } = require("../../helpers/index");


const getAll = async (req, res) => {
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch, id: authId} = req.auth;
    const { 
        branch, 
        page, 
        limit, 
        resource, 
        createdAt, 
        conManager, 
        conAgent, 
        office, 
        openFilter
    } = req.query;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    const skip = (page - 1) * limit;
    let result;
    let allLeads;
    let totalPages;
    let filteredLeads;
    let totalFilteredLeads;



    const sortingAndResponseForAdmin = (allLeads, res) => {
        if(!allLeads || allLeads.length === 0){
            return res.status(404).send({message: `No Leads Found`});
        } else {
            filteredLeads = allLeads;
            if (resource) {
                filteredLeads = filteredLeads.filter(lead => lead.resource === resource);
            }
            if (conManager) {
                if (conManager === "Not Defined") {
                    filteredLeads = filteredLeads.filter(lead => !lead.conManager || lead.conManager.name === "");
                } else {
                    filteredLeads = filteredLeads.filter(lead => lead.conManager.name === conManager);
                }
            }
            if (conAgent) {
                if (conAgent === "Not Defined") {
                    filteredLeads = filteredLeads.filter(lead => !lead.conAgent || lead.conAgent.name === "");
                } else {
                    filteredLeads = filteredLeads.filter(lead => lead.conAgent.name === conAgent);
                }
            }
            if (office) {
                filteredLeads = filteredLeads.filter(lead => lead.assignedOffice === office);
            }
            if (createdAt) {
                const [year, month, day] = createdAt.split('-');
                const startDate = new Date(year, month - 1, day);
                const endDate = new Date(year, month - 1, day + 1);
        
                filteredLeads = filteredLeads.filter(lead => {
                    const leadDate = new Date(lead.createdAt);
                    return leadDate >= startDate && leadDate < endDate;
                });
            }
            if (openFilter) {
                const regex = new RegExp(openFilter, "i")
                filteredLeads = filteredLeads.filter(lead => {
                    return regex.test(lead.name) || 
                    regex.test(lead.lastName) || 
                    regex.test(lead.email) || 
                    regex.test(lead.phone);
                });
            }


            filteredLeads = filteredLeads.sort((a, b) => {
                if (a.newContact === b.newContact) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return a.newContact ? -1 : 1;
            });
    
            totalFilteredLeads = filteredLeads.length;
            totalPages = Math.ceil(totalFilteredLeads / limit);
    
            result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
            res.status(200).send({totalPages, result, totalFilteredLeads});
        }
    };




    const sortingAndResponse = (allLeads, res) => {
        if(!allLeads || allLeads.length === 0){
            return res.status(404).send({message: `No Leads Found`});
        } else {
            filteredLeads = allLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
            totalFilteredLeads = filteredLeads.length;
            totalPages = Math.ceil(totalFilteredLeads / limit);
    
            result = filteredLeads.slice(parseInt(skip), parseInt(skip) + parseInt(limit));
            res.status(200).send({totalPages, result, totalFilteredLeads});
        }
    };




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
                    sortingAndResponseForAdmin(allLeads, res);
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
                    sortingAndResponseForAdmin(allLeads, res);
                break;


                default: 
                    allLeads = await Leads.find();
                    sortingAndResponseForAdmin(allLeads, res);
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
                    sortingAndResponse(allLeads, res);
                break;


                case "Conversion Manager":
                    allLeads = await Office1Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                    sortingAndResponse(allLeads, res);
                break;


                case "Conversion Agent":
                    allLeads = await Office1Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    });
                    sortingAndResponse(allLeads, res);
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
                    sortingAndResponse(allLeads, res);
                break;


                case "Conversion Manager":
                    allLeads = await Office2Leads.find({
                        $or: [{conManagerId: authId}, {'owner.id': authId}]
                    })
                    .populate({
                        path: 'conAgentId',
                        select: 'username'
                    });
                    sortingAndResponse(allLeads, res);
                break;


                case "Conversion Agent":
                    allLeads = await Office2Leads.find({
                        $or: [{conAgentId: authId}, {'owner.id': authId}]
                    });
                    sortingAndResponse(allLeads, res);
                break;


                default:
                    return res.status(400).send({ message: 'Authorization role is invalid' });
            };
            break;
        default:
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };
};



module.exports = { 
    getAll: ctrlWrapper(getAll)
};
