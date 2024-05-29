const express = require("express");
const router = express.Router();
const {
  externalLead,
  leadAssign,
  getAll,
  addNewLead,
  leadReAssign,
  getAllStatus,
  updateStatus,
  changeBaseInfo,
  updateLeadCountry,
  updateLeadCity,
  updateLeadRegion,
  getAllTimeZone,
  updateLeadTimeZone,
  updateLeadComment,
  updateLeadKYC,
  updateLeadLastCall,
  updateLeadNextCall,
  getLeadById,
  getAllLeadComments,
  deleteLeadById,
} = require("../../controllers/leads/index");
const {
  validateBodyExternal,
  authenticate,
  validOfficeAssignedSchema,
  isValidLeadId,
  addNewLeadSchema,
  updateLeadStatus,
  chnageBaseInfoSchema,
  validLeadCountry,
  validLeadRegion,
  updateTimeZone,
  validLeadCity,
  validLeadKYC,
  updateLastCall,
  updateNextCall,
} = require("../../middlewares/index");
const { externalLeadsSchemas } = require("../../models/ExternalLead");


router.post("/external", validateBodyExternal(
  externalLeadsSchemas.addExternalLeadSchema), externalLead.externalLead
);

router.get("/all", authenticate, getAll.getAll);


router.post("/assign/:leadId", authenticate, validOfficeAssignedSchema,
  isValidLeadId, leadAssign.leadAssign
);


router.post("/", authenticate, addNewLeadSchema, addNewLead.addNewLead);


router.put("/reassign/:leadId", authenticate, isValidLeadId,
  leadReAssign.leadReAssign
);


router.patch("/:leadId", authenticate, chnageBaseInfoSchema,
  isValidLeadId, changeBaseInfo.changeBaseInfo
);


router.get("/allstatus", authenticate, getAllStatus.getAllStatus);


router.patch("/status/:leadId", authenticate, updateLeadStatus,
  isValidLeadId, updateStatus.updateStatus
);


router.patch("/country/:leadId", authenticate, validLeadCountry,
  isValidLeadId, updateLeadCountry.updateLeadCountry
);


router.patch("/region/:leadId", authenticate, isValidLeadId,
  validLeadRegion, updateLeadRegion.updateLeadRegion
);


router.patch("/city/:leadId", authenticate, isValidLeadId,
  validLeadCity, updateLeadCity.updateLeadCity
);


router.get("/alltimezone", authenticate, getAllTimeZone.getAllTimeZone);


router.patch("/timezone/:leadId", authenticate, updateTimeZone,
  isValidLeadId, updateLeadTimeZone.updateLeadTimeZone
);


router.patch("/comment/:leadId", authenticate, isValidLeadId, 
  updateLeadComment.updateLeadComment
);


router.patch("/kyc/:leadId", authenticate, isValidLeadId, 
  validLeadKYC, updateLeadKYC.updateLeadKYC
);


router.patch("/lastcall/:leadId", authenticate, isValidLeadId, 
  updateLastCall, updateLeadLastCall.updateLeadLastCall
);


router.patch("/nextcall/:leadId", authenticate, isValidLeadId, 
  updateNextCall, updateLeadNextCall.updateLeadNextCall
);


router.get('/:leadId', authenticate, isValidLeadId, getLeadById.getLeadById);


router.get('/allComments/:leadId', authenticate, isValidLeadId, getAllLeadComments.getAllLeadComments);


router.delete("/:leadId",authenticate, isValidLeadId, deleteLeadById.deleteLeadById);


module.exports = router;
