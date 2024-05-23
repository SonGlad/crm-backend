const express = require("express");
const router = express.Router();
const {
  externalLead,
  leadAssign,
  getAll,
  addNewLead,
  leadReAssign,
    changeBaseInfo,
    getAllStatus,
  updateStatus,
  // getById,
  // updateById,
  // deleteById,
} = require("../../controllers/leads/index");
const {
  validateBodyExternal,
  authenticate,
  validOfficeAssignedSchema, 
  isValidLeadId, 
  addNewLeadSchema,
    chnageBaseInfoSchema,
    updateLeadStatus,
  // validateBody, 
} = require("../../middlewares/index");
const { externalLeadsSchemas } = require("../../models/ExternalLead");



router.post("/external",  validateBodyExternal(
  externalLeadsSchemas.addExternalLeadSchema),  externalLead.externalLead
);

router.get("/all", authenticate, getAll.getAll);


router.post("/assign/:leadId", authenticate,  validOfficeAssignedSchema,
  isValidLeadId,  leadAssign.leadAssign
);


router.post("/", authenticate, addNewLeadSchema, addNewLead.addNewLead);


router.put("/reassign/:leadId", authenticate, isValidLeadId,
  leadReAssign.leadReAssign
);


router.patch('/:leadId', authenticate, chnageBaseInfoSchema, 
  isValidLeadId, changeBaseInfo.changeBaseInfo
);

router.get("/allstatus", authenticate, getAllStatus.getAllStatus)

router.post("/status/:leadId", authenticate, updateLeadStatus, updateStatus.updateStatus)


// router.get('/:contactId', authenticate, isValidContactId, getById.getById);

// router.patch('/:contactId',authenticate, isValidContactId, validateBody(
//     schemas.updateSchema), updateById.updateById);

// router.delete("/:contactId",authenticate, isValidContactId, deleteById.deleteById);

module.exports = router;
