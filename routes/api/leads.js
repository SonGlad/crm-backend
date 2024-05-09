const express = require('express');
const router = express.Router();
const {
    externalLead,
    leadAssign, 
    getAll,
    // addNewContact,
    // getAllByResource,
    // getById, 
    // updateById, 
    // deleteById,
    // updateNewContactById,
} = require("../../controllers/leads/index");
const {
    validateBodyExternal,
    authenticate,
    validOfficeAssignedSchema, 
    isValidLeadId, 
    // validateBody, 
} = require("../../middlewares/index");
const  { 
    externalLeadsSchemas 
}  = require("../../models/ExternalLead");



router.post('/external',validateBodyExternal(
    externalLeadsSchemas.addExternalLeadSchema), externalLead.externalLead);

router.get('/all', authenticate, getAll.getAll);

router.post('/assign/:leadId', authenticate, validOfficeAssignedSchema, 
    isValidLeadId, leadAssign.leadAssign);


// router.post('/',authenticate, validateBody(
//     schemas.addAdminPanelContactSchema), addNewContact.addNewContact);


// router.get('/allbyresource', authenticate, getAllByResource.getAllByResource);

// router.get('/:contactId', authenticate, isValidContactId, getById.getById);


// router.patch('/:contactId',authenticate, isValidContactId, validateBody(
//     schemas.updateSchema), updateById.updateById);

// router.patch('/:contactId/newContact', authenticate, isValidContactId, validateBody(
//     schemas.updateNewContactSchema), updateNewContactById.updateNewContactById);

// router.delete("/:contactId",authenticate, isValidContactId, deleteById.deleteById);



module.exports = router;

