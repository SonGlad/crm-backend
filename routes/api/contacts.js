const express = require('express');


const router = express.Router();
const {
    getAll,
    getAllByResource,
    getById, 
    addNewContact,
    externalContact, 
    updateById, 
    deleteById,
    updateNewContactById,
} = require("../../controllers/contacts/index");
const {validateBody, validateBodyExternal, isValidId, authenticate} = require("../../middlewares/index");
const  { schemas }  = require("../../models/contact");


router.get('/all', authenticate, getAll.getAll);

router.get('/allbyresource', authenticate, getAllByResource.getAllByResource);

router.get('/:contactId', authenticate, isValidId, getById.getById);

router.post('/',authenticate, validateBody(
    schemas.addAdminPanelContactSchema), addNewContact.addNewContact);

router.post('/external',validateBodyExternal(
    schemas.addExternalContactSchema), externalContact.externalContact);

router.patch('/:contactId',authenticate, isValidId, validateBody(
    schemas.updateSchema), updateById.updateById);

router.patch('/:contactId/newContact', authenticate, isValidId, validateBody(
    schemas.updateNewContactSchema), updateNewContactById.updateNewContactById);

router.delete("/:contactId",authenticate, isValidId, deleteById.deleteById);



module.exports = router;

