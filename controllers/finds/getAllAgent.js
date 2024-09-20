const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office1User } = require("../../models/Office1User");
const { Office2Leads } = require("../../models/Office2Leads");
const { Office2User } = require("../../models/Office2User");


const getAllAgent = async (req, res) => {
  const { role: authRole, branch: authBranch } = req.auth;
  const { branch } = req.query;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }


  let leads;
  let usersModel; 


  const agentResponse = async (leads, usersModel, res) => {
    if(!leads || leads.length === 0){
      return res.status(404).send({message: `No Leads found`});
    } else {
      const leadAgentIds = leads.filter(lead => lead.conAgentId).map(lead => lead.conAgentId);

      if (leadAgentIds.length === 0) {
        return res.status(404).send({message: `There no Agents Available`});
      }
      const agents = await usersModel.find({ _id: { $in: leadAgentIds } }).select("username");
      
      const agentNames = agents.map(agent => agent.username);
      const uniqueAgentNames = [...new Set(agentNames)];
      return res.status(200).send(uniqueAgentNames);
    }
  };


  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          leads = await Office1Leads.find();
          usersModel = Office1User;
          await agentResponse(leads, usersModel, res);
        break;

        case "Office2":
          leads = await Office2Leads.find();
          usersModel = Office2User;
          await agentResponse(leads, usersModel, res);
        break;

        default:
          return res.status(403).send({message: `Invalid branch!`});
      }
    break;

    case "Office1":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office1Leads.find();
          usersModel = Office1User;
          await agentResponse(leads, usersModel, res);
        break;

        case "Conversion Manager":
          leads = await Office1Leads.find();
          usersModel = Office1User;
          await agentResponse(leads, usersModel, res);
        break;

        case "Conversion Agent":
          res.status(403).send({message: `You do not have access rights`});
        break;

        default:
          return res.status(403).send({message: `Invalid role of user!`});
        }
    break;

    case "Office2":
      switch (authRole) {
        case "CRM Manager":
          leads = await Office2Leads.find();
          usersModel = Office2User;
          await agentResponse(leads, usersModel, res);
        break;

        case "Conversion Manager":
          leads = await Office2Leads.find();
          usersModel = Office2User;
          await agentResponse(leads, usersModel, res);
        break;

        case "Conversion Agent":
          res.status(403).send({message: `You do not have access rights`});
        break;

        default:
          return res.status(403).send({message: `Invalid role of user!`});
      }
    break;

    default:
      res.status(404).send({message: `${authBranch} branch dosen't exist!`});
  }
};

module.exports = {
  getAllAgent: ctrlWrapper(getAllAgent),
};
