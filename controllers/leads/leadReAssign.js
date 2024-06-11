const { ctrlWrapper } = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { Office1Leads } = require("../../models/Office1Leads");
const { Office2Leads } = require("../../models/Office2Leads");
const { User } = require("../../models/MainUser");
const { AllCommentsSchema } = require("../../models/LeadsComments");
const { Leads } = require("../../models/externalLead");

const leadReAssign = async (req, res) => {
  const { role: authRole, branch: authBranch, id: authId } = req.auth;
  const { leadId } = req.params;
  const { branch, conManagerId, conAgentId } = req.body;
  const { role: userRole, branch: userBranch } = req.user;

  if (authRole !== userRole || authBranch !== userBranch) {
    return res.status(403).send({ message: "Forbidden: Access denied" });
  }

  let lead;
  let officeUser;
  let mainUser;
  let convertionManagerId;
  let convertionAgentId;
  let assignedLead;
  let leadBeforeChenges;
  let prevUserId;
  let newAssignedLead;



  switch (authBranch) {
    case "Office1":
      lead = await Office1Leads.findById(leadId);
      switch (authRole) {
        case "Conversion Manager":
          switch (lead.selfCreated) {
            case false:
              officeUser = await Office1User.findById({ _id: authId });
              convertionAgentId = await Office1User.findById({
                _id: conAgentId,
              });
              if (convertionAgentId.role === "Conversion Agent") {
                leadBeforeChenges = await Office1Leads.findById(leadId);
                if (leadBeforeChenges.conAgentId) {
                  prevUserId = await Office1User.findById({
                    _id: leadBeforeChenges.conAgentId,
                  });
                }
                if (!convertionAgentId) {
                  res.status(404).send({
                    message: "Conversion agent not found",
                  });
                }

                assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
                  conAgentId: convertionAgentId._id,
                  assigned: false,
                  latestComment: {
                    createdBy: {
                      username: officeUser.username,
                      email: officeUser.email,
                      branch: authBranch,
                      role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: prevUserId
                      ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                      : "created",
                  },
                });
                await AllCommentsSchema.create({
                  ownerLeadId_office1: leadId,
                  createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                  },
                  createdAt: Date.now(),
                  comment: prevUserId.username
                    ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                    : "This is first assign",
                });
                console.log(assignedLead.externalLeadId);
                await Leads.findByIdAndUpdate(
                  assignedLead.externalLeadId,
                  {
                    conAgent: {
                      name: convertionAgentId.username,
                      email: convertionAgentId.email,
                    },
                  },
                  { new: true }
                );
                res.status(200).send({ assignedLead });
              } else {
                res.status(403).send({
                  message: "You must reasign to 'Conversion Agent'!",
                });
              }
              break;
            default:
              res.status(403).send({
                message: "You are not authorized to reassign self created lead",
              });
          }
          break;

        case "CRM Manager":
          convertionManagerId = await Office1User.findById({
            _id: conManagerId,
          });
          if (convertionManagerId.role === "Conversion Manager") {
            switch (lead.selfCreated) {
              case false:
                officeUser = await Office1User.findById({ _id: authId });
                leadBeforeChenges = await Office1Leads.findById(leadId);
                if (leadBeforeChenges.role === "Retention Manager") {
                  res.status(403).send({
                    message: "You can not reassign to 'Retention Manager'",
                  });
                }
                if (leadBeforeChenges.conManagerId) {
                  prevUserId = await Office1User.findById({
                    _id: leadBeforeChenges.conManagerId,
                  });
                }

                if (!convertionManagerId) {
                  res.status(404).send({
                    message: "Conversion manager not found",
                  });
                }

                assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
                  conManagerId: convertionManagerId._id,
                  latestComment: {
                    createdBy: {
                      username: officeUser.username,
                      email: officeUser.email,
                      branch: authBranch,
                      role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: prevUserId
                      ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                      : "created",
                  },
                });
                await AllCommentsSchema.create({
                  ownerLeadId_office1: leadId,
                  createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                  },
                  createdAt: Date.now(),
                  comment: prevUserId.username
                    ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                    : "This is first assign",
                });
                await Leads.findByIdAndUpdate(
                  assignedLead.externalLeadId,
                  {
                    conManager: {
                      name: convertionManagerId.username,
                      email: convertionManagerId.email,
                    },
                    conAgent: {
                      name: null,
                      email: null,
                    },
                  },
                  { new: true }
                );
                newAssignedLead = await Office1Leads.findById({ _id: leadId });
                res.status(200).send({ newAssignedLead });
                break;
              default:
                res.status(403).send({
                  message:
                    "You are not authorized to reassign self created lead",
                });
            }
          } else {
            res.status(403).send({
              message: "You must reassign to 'Conversion Manager'",
            });
          }

          break;

        default:
          res.status(404).send({
            message: "You don't have the right permissions in this branch",
          });
      }
      break;

    case "Office2":
      lead = await Office2Leads.findById(leadId);
      switch (authRole) {
        case "Conversion Manager":
          switch (lead.selfCreated) {
            case false:
              officeUser = await Office2User.findById({ _id: authId });
              convertionAgentId = await Office2User.findById({
                _id: conAgentId,
              });
              if (convertionAgentId.role === "Conversion Agent") {
                leadBeforeChenges = await Office2Leads.findById(leadId);
                if (leadBeforeChenges.conAgentId) {
                  prevUserId = await Office2User.findById({
                    _id: leadBeforeChenges.conAgentId,
                  });
                }

                if (!convertionAgentId) {
                  res.status(404).send({
                    message: "Conversion agent not found",
                  });
                }

                assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
                  conAgentId: convertionAgentId._id,
                  latestComment: {
                    createdBy: {
                      username: officeUser.username,
                      email: officeUser.email,
                      branch: authBranch,
                      role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: prevUserId
                      ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                      : "created",
                  },
                });
                await AllCommentsSchema.create({
                  ownerLeadId_office1: leadId,
                  createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                  },
                  createdAt: Date.now(),
                  comment: prevUserId.username
                    ? `Current lead was reassigned from agent ${prevUserId.username} to ${officeUser.username}`
                    : "This is first assign",
                });

                await Leads.findByIdAndUpdate(
                  assignedLead.externalLeadId,
                  {
                    conAgent: {
                      name: convertionAgentId.username,
                      email: convertionAgentId.email,
                    },
                  },
                  { new: true }
                );
                res.status(200).send({ assignedLead });
              } else {
                res.status(403).send({
                  message: "You must reasign to 'Conversion Agent'!",
                });
              }

              break;
            default:
              res.status(403).send({
                message: "You are not authorized to reassign self created lead",
              });
          }
          break;

        case "CRM Manager":
          convertionManagerId = await Office2User.findById({
            _id: conManagerId,
          });
          if (convertionManagerId.role === "Conversion Manager") {
            console.log(lead.selfCreated);
            switch (lead.selfCreated) {
              case false:
                officeUser = await Office2User.findById({ _id: authId });
                leadBeforeChenges = await Office2Leads.findById(leadId);
                if (leadBeforeChenges.conManagerId) {
                  prevUserId = await Office2User.findById({
                    _id: leadBeforeChenges.conManagerId,
                  });
                }

                if (!convertionManagerId) {
                  res.status(404).send({
                    message: "Conversion manager not found",
                  });
                }

                assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
                  conManagerId: convertionManagerId._id,
                  assigned: false,
                  latestComment: {
                    createdBy: {
                      username: officeUser.username,
                      email: officeUser.email,
                      branch: authBranch,
                      role: authRole,
                    },
                    createdAt: Date.now(),
                    comment: prevUserId
                      ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                      : "created",
                  },
                });

                await AllCommentsSchema.create({
                  ownerLeadId_office1: leadId,
                  createdBy: {
                    username: officeUser.username,
                    email: officeUser.email,
                    branch: authBranch,
                    role: authRole,
                  },
                  createdAt: Date.now(),
                  comment: prevUserId.username
                    ? `Current lead was reassigned from manager ${prevUserId.username} to ${officeUser.username}`
                    : "This is first assign",
                });
                await Leads.findByIdAndUpdate(
                  assignedLead.externalLeadId,
                  {
                    conManager: {
                      name: convertionManagerId.username,
                      email: convertionManagerId.email,
                    },
                    conAgent: {
                      name: null,
                      email: null,
                    },
                  },
                  { new: true }
                );
                console.log(leadId);
                newAssignedLead = await Office2Leads.findById({ _id: leadId });
                res.status(200).send({ newAssignedLead });
                break;
              default:
                res.status(403).send({
                  message:
                    "You are not authorized to reassign self created lead",
                });
            }
          } else {
            res.status(403).send({
              message: "You must reassign to 'Conversion Manager'",
            });
          }

          break;

        default:
          res.status(404).send({
            message: "You don't have the right permissions in this branch",
          });
      }
      break;

    case "Main":
      switch (branch) {
        case "Office2":
          mainUser = await User.findById({ _id: authId });
          if (await Office2Leads.findById(leadId)) {
            res.status(404).send({
              message: `This lead exist in ${branch} branch!`,
            });
          }

          assignedLead = await Office1Leads.findByIdAndUpdate(leadId, {
            conManagerId: null,
            conAgentId: null,
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment: `Current lead was reassigned from branch Office1 to Office2`,
            },
          });

          await AllCommentsSchema.create({
            ownerLeadId_office1: leadId,
            createdBy: {
              username: mainUser.username,
              email: mainUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment:
              "Current lead was reassigned from branch Office1 to Office2",
          });

          await Leads.findByIdAndUpdate(
            assignedLead.externalLeadId,
            {
              assignedOffice: branch,
              conManager: {
                name: null,
                email: null,
              },
            },
            { new: true }
          );

          await Office2Leads.create({
            ...assignedLead.toObject(),
            managerId: null,
            conManagerId: null,
            conAgentId: null,
            branch: branch,
            _id: null,
          });
          newAssignedLead = await Office2Leads.findOne({
            clientId: assignedLead.clientId,
          });

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office1: assignedLead._id },
            { $rename: { ownerLeadId_office1: "ownerLeadId_office2" } }
          );

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office2: assignedLead._id },
            { $set: { ownerLeadId_office2: newAssignedLead._id } }
          );

          await Office1Leads.deleteOne({ _id: assignedLead._id });

          res.status(200).send({ newAssignedLead });
          break;

        case "Office1":
          mainUser = await User.findById({ _id: authId });
          if (await Office1Leads.findById(leadId)) {
            res.status(404).send({
              message: `This lead exist in ${branch} branch!`,
            });
          }

          assignedLead = await Office2Leads.findByIdAndUpdate(leadId, {
            conManagerId: null,
            conAgentId: null,
            latestComment: {
              createdBy: {
                username: mainUser.username,
                email: mainUser.email,
                branch: authBranch,
                role: authRole,
              },
              createdAt: Date.now(),
              comment:
                "Current lead was reassigned from branch Office2 to Office1",
            },
          });

          await AllCommentsSchema.create({
            ownerLeadId_office2: leadId,
            createdBy: {
              username: mainUser.username,
              email: mainUser.email,
              branch: authBranch,
              role: authRole,
            },
            createdAt: Date.now(),
            comment:
              "Current lead was reassigned from branch Office2 to Office1",
          });

          await Leads.findByIdAndUpdate(
            assignedLead.externalLeadId,
            {
              assignedOffice: branch,
              conManager: {
                name: null,
                email: null,
              },
            },
            { new: true }
          );

          await Office1Leads.create({
            ...assignedLead.toObject(),
            managerId: null,
            conManagerId: null,
            conAgentId: null,
            branch: branch,
            _id: null,
          });
          newAssignedLead = await Office1Leads.findOne({
            clientId: assignedLead.clientId,
          });

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office2: assignedLead._id },
            { $rename: { ownerLeadId_office2: "ownerLeadId_office1" } }
          );

          await AllCommentsSchema.updateMany(
            { ownerLeadId_office1: assignedLead._id },
            { $set: { ownerLeadId_office1: newAssignedLead._id } }
          );

          await Office2Leads.deleteOne({ _id: assignedLead._id });

          res.status(200).send({ newAssignedLead });
          break;

        default:
          res.status(404).send({
            message: `${branch} branch dosen't exist!`,
          });
      }
      break;

    default:
      res.status(400).send({
        message: "Your branch dont have permissions to reassing this lead",
      });
  }
};

module.exports = {
  leadReAssign: ctrlWrapper(leadReAssign),
};
