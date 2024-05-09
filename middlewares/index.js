const validateBody = require("./validateBody");
const isValidLeadId = require("./isValidLeadId");
const authenticate = require("./authenticate");
const validRegisterSchema = require("./validRegisterSchema");
const validLoginSchema = require("./validLoginSchema");
const validUpdateUserInfoSchema = require("./validUpdateUserInfoSchema");
const validVerifySchema = require("./validVerifySchema");
const isValidUserId = require("./isValidUserId");
const upload = require("./upload");
const updateAvatarM = require("./updateAvatarM");
const validateBodyExternal = require("./leads/validateBodyExternal");
const validOfficeAssignedSchema = require("./leads/validOfficeAssignedSchema");


module.exports =  { 
    validateBody, 
    isValidLeadId, 
    authenticate,
    validRegisterSchema,
    validLoginSchema,
    validUpdateUserInfoSchema,
    validVerifySchema,
    isValidUserId, 
    updateAvatarM,
    upload, 
    validateBodyExternal,
    validOfficeAssignedSchema
};