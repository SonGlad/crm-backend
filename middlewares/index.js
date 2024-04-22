const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const validateBodyExternal = require("./validateBodyExternal");
const validRegisterSchema = require("./validRegisterSchema");
const validLoginSchema = require("./validLoginSchema");
const validUpdateUserInfoSchema = require("./validUpdateUserInfoSchema");
const upload = require("./upload");
const updateAvatarM = require("./updateAvatarM");


module.exports =  { 
    validateBody, 
    isValidId, 
    authenticate,
    validateBodyExternal,
    validRegisterSchema,
    validLoginSchema,
    validUpdateUserInfoSchema, 
    updateAvatarM,
    upload, 
};