const express = require('express');
const router = express.Router();
const {
    externalLead, 
    // getAll,
    // getAllByResource,
    // getById, 
    // addNewContact,
    // updateById, 
    // deleteById,
    // updateNewContactById,
} = require("../../controllers/leads/index");
const {
    validateBodyExternal, 
    // validateBody, 
    // isValidContactId, 
    // authenticate
} = require("../../middlewares/index");
const  { 
    externalLeadsSchemas 
}  = require("../../models/externalLead");



router.post('/external',validateBodyExternal(
    externalLeadsSchemas.addExternalLeadSchema), externalLead.externalLead);

// router.get('/all', authenticate, getAll.getAll);

// router.get('/allbyresource', authenticate, getAllByResource.getAllByResource);

// router.get('/:contactId', authenticate, isValidContactId, getById.getById);

// router.post('/',authenticate, validateBody(
//     schemas.addAdminPanelContactSchema), addNewContact.addNewContact);

// router.patch('/:contactId',authenticate, isValidContactId, validateBody(
//     schemas.updateSchema), updateById.updateById);

// router.patch('/:contactId/newContact', authenticate, isValidContactId, validateBody(
//     schemas.updateNewContactSchema), updateNewContactById.updateNewContactById);

// router.delete("/:contactId",authenticate, isValidContactId, deleteById.deleteById);



module.exports = router;

