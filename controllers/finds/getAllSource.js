const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");

const getAllSource = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { branch } = req.body;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let leads;
  let leadSource;
  let uniqueResources;
  let noSelfCreatedLead;
  let SelfCreatedLead;
  

  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          leads = await Office1Leads.find();
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        case "Office2":
          leads = await Office2Leads.find();
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        default:
          res.status(403).send({
            message: `Invalid branch!`,
          });
      }
      break;
    case "Office1":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office1Leads.find();
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        case "Conversion Manager":
          leads = await Office1Leads.find({ conManagerId: authId });
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        case "Conversion Agent":
               if (await Office1Leads.find({ conAgentId: authId })) {
            noSelfCreatedLead = await Office1Leads.find({ conAgentId: authId });
          }
          if (await Office1Leads.find({ 'owner.id': authId })) {
            SelfCreatedLead = await Office1Leads.find({ 'owner.id': authId })
          }

          leads = [...noSelfCreatedLead, ...SelfCreatedLead];
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];

          res.status(200).send(uniqueResources);
          break;
        default:
          res.status(403).send({
            message: `Invalid role of user!`,
          });
      }
      break;
    case "Office2":
            switch (authRole) {
        case "CRM Manager":
          leads = await Office2Leads.find();
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        case "Conversion Manager":
          leads = await Office2Leads.find({ conManagerId: authId });
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];
          res.status(200).send(uniqueResources);
          break;
        case "Conversion Agent":
               if (await Office2Leads.find({ conAgentId: authId })) {
            noSelfCreatedLead = await Office2Leads.find({ conAgentId: authId });
          }
          if (await Office2Leads.find({ 'owner.id': authId })) {
            SelfCreatedLead = await Office2Leads.find({ 'owner.id': authId })
          }

          leads = [...noSelfCreatedLead, ...SelfCreatedLead];
          leadSource = leads.map((lead) => lead.resource);
          uniqueResources = [...new Set(leadSource)];

          res.status(200).send(uniqueResources);
          break;
        default:
          res.status(403).send({
            message: `Invalid role of user!`,
          });
      }
      break;
    default:
      res.status(404).send({
        message: `${authBranch} branch dosen't exist!`,
      });
  }
};

module.exports = {
  getAllSource: ctrlWrapper(getAllSource),
};
