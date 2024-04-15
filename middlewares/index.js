const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const validateBodyExternal = require("./validateBodyExternal");
const upload = require("./upload");
const updateAvatarM = require("./updateAvatarM");


module.exports =  { 
    validateBody, 
    isValidId, 
    authenticate,
    validateBodyExternal,
    updateAvatarM,
    upload, 
};