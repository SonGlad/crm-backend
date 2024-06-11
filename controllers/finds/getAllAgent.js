const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office1User } = require("../../models/Office1User");
const { Office2Leads } = require("../../models/Office2Leads");
const { Office2User } = require("../../models/Office2User");

const getAllAgent = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { branch } = req.body;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let users;
    let userAgent;
    let userAgentIds;
    let userAgents;
    let userNames;

  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          users = await Office1User.find({ role: "Conversion Agent" });
          userAgent = users.map((user) => user.username)

          res.status(200).send(userAgent);
          break;
        case "Office2":
          users = await Office2User.find({ role: "Conversion Agent" });
          userAgent = users.map((user) => user.username)

          res.status(200).send(userAgent);
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
          users = await Office1User.find({ role: "Conversion Agent" });
          userAgent = users.map((user) => user.username)

          res.status(200).send(userAgent);
          break;
        case "Conversion Manager":
           users = await Office1Leads.find({ conManagerId: authId });
                  userAgentIds = [...new Set(users.map(user => user.conAgentId).filter(id => id))];
         userAgents = await Office1User.find({ _id: { $in: userAgentIds } });
         userNames = userAgents.map(user => user.username);
        res.status(200).send(userNames);
          break;
        case "Conversion Agent":
  res.status(403).send({
            message: `You do not have access rights`,
          });
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
          users = await Office2User.find({ role: "Conversion Agent" });
          userAgent = users.map((user) => user.username)

          res.status(200).send(userAgent);
          break;
        case "Conversion Manager":
           users = await Office2Leads.find({ conManagerId: authId });
                  userAgentIds = [...new Set(users.map(user => user.conAgentId).filter(id => id))];
         userAgents = await Office2User.find({ _id: { $in: userAgentIds } });
         userNames = userAgents.map(user => user.username);
        res.status(200).send(userNames);
          break;
        case "Conversion Agent":
  res.status(403).send({
            message: `You do not have access rights`,
          });
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
  getAllAgent: ctrlWrapper(getAllAgent),
};
