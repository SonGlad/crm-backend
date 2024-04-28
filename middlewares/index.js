const validateBody = require("./validateBody");
const isValidContactId = require("./isValidContactId");
const authenticate = require("./authenticate");
const validateBodyExternal = require("./validateBodyExternal");
const validRegisterSchema = require("./validRegisterSchema");
const validLoginSchema = require("./validLoginSchema");
const validUpdateUserInfoSchema = require("./validUpdateUserInfoSchema");
const validVerifySchema = require("./validVerifySchema");
const isValidUserId = require("./isValidUserId");
const upload = require("./upload");
const updateAvatarM = require("./updateAvatarM");


module.exports =  { 
    validateBody, 
    isValidContactId, 
    authenticate,
    validateBodyExternal,
    validRegisterSchema,
    validLoginSchema,
    validUpdateUserInfoSchema,
    validVerifySchema,
    isValidUserId, 
    updateAvatarM,
    upload, 
};