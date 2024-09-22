const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { Leads } = require("../../models/externalLead");


const getAllCreatedAt = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { branch } = req.query;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let leads;

  const createdAtResponse = (leads, res) => {
    if(!leads || leads.length === 0) {
      return res.status(404).send({message: `No filter option available`});
    } else {
      const leadCreatedAt = leads.map((lead) => {
        return new Date(lead.createdAt).toISOString().slice(0, 10); 
      });
      const uniqueCreatedAt = [...new Set(leadCreatedAt)].sort((a, b) => b.localeCompare(a));
      return res.status(200).send(uniqueCreatedAt);
    }
  };
  

  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          leads = await Office1Leads.find();
          createdAtResponse(leads, res);
        break;

        case "Office2":
          leads = await Office2Leads.find();
          createdAtResponse(leads, res);
        break;

        default:
          leads = await Leads.find();
          createdAtResponse(leads, res);
      }
    break;

    case "Office1":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office1Leads.find({
            $or: [{managerId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;

        case "Conversion Manager":
          leads = await Office1Leads.find({
            $or: [{conManagerId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;
        
        case "Conversion Agent":
          leads = await Office1Leads.find({
            $or: [{conAgentId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;

        default:
          return res.status(403).send({message: `Invalid role of user!`});
      }
    break;

    case "Office2":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office2Leads.find({
            $or: [{managerId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;

        case "Conversion Manager":
          leads = await Office2Leads.find({
            $or: [{conManagerId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;

        case "Conversion Agent":
          leads = await Office2Leads.find({
            $or: [{conAgentId: authId}, {'owner.id': authId }]
          });
          createdAtResponse(leads, res);
        break;

        default:
          return res.status(403).send({message: `Invalid User Role!`});
      }
    break;

    default:
      return res.status(404).send({message: `${authBranch} branch dosen't exist!`});
  }
};


module.exports = {
  getAllCreatedAt: ctrlWrapper(getAllCreatedAt),
};