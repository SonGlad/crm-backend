const { ctrlWrapper } = require("../../helpers");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");

const getAllResults = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { role: userRole, branch: userBranch } = req.user;
  const { branch } = req.body;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  const {
    page,
    limit,
    source,
    country,
    region,
    city,
    lastupdate,
    created,
    agent,
    nextcall,
  } = req.query;

  let leads;
  let filter;

  switch (authRole) {
    case "Developer":
    case "Administrator":
    case "Manager":
    case "CRM Manager":
      filter = {};
      break;
    case "Conversion Manager":
      filter = { $or: [{ conManagerId: authId }, { "owner.id": authId }] };
      break;
    case "Conversion Agent":
      filter = { $or: [{ conAgentId: authId }, { "owner.id": authId }] };
      break;
    default:
      res.status(403).send({
        message: `Invalid role of user!`,
      });
  }

  if (source) filter.resource = new RegExp(source, "i");
  if (country) filter.country = new RegExp(country, "i");
  if (region) filter.region = new RegExp(region, "i");
  if (city) filter.city = new RegExp(city, "i");
  if (agent) {
    filter.$or = filter.$or || [];
    filter.$or.push({ conAgentId: agent }, { "owner.id": agent });
  }
  if (lastupdate) filter.updatedAt = { $gte: new Date(lastupdate) };
  if (created) filter.createdAt = { $gte: new Date(created) };
  if (nextcall) filter.nextCall = { $gte: new Date(nextcall) };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 30),
    lean: true,
    sort: { createdAt: -1 },
  };

  switch (authBranch) {
    case "Main":
      switch (branch) {
        case "Office1":
          leads = await Office1Leads.paginate(filter, options);
          res.status(200).send(leads);
          break;
        case "Office2":
          leads = await Office2Leads.paginate(filter, options);
          res.status(200).send(leads);
          break;
        default:
          res.status(403).send({
            message: `Invalid branch!`,
          });
      }
      break;
    case "Office1":
      leads = await Office1Leads.paginate(filter, options);
      res.status(200).send(leads);
      break;
    case "Office2":
      leads = await Office2Leads.paginate(filter, options);
      res.status(200).send(leads);
      break;
    default:
      res.status(403).send({
        message: `Invalid branch of user!`,
      });
  }
};

module.exports = {
  getAllResults: ctrlWrapper(getAllResults),
};

// http://localhost:8080/finds/results?page=1&limit=2&source=&country=&city=&region=&lastupdate=&created=&agent=&nexcall
