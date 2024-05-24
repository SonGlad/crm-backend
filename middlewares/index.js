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
const addNewLeadSchema = require("./leads/addNewLeadSchema");
const chnageBaseInfoSchema = require("./leads/chnageBaseInfoSchema");
const updateLeadStatus =require("./leads/updateLeadStatus")
const validLeadCountry = require("./leads/validLeadCountry");
const validLeadRegion = require("./leads/validLeadRegion");
const validLeadCity = require("./leads/validLeadCity");
const updateTimeZone = require("./leads/updateTimeZone")


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
    validOfficeAssignedSchema,
    addNewLeadSchema,
    chnageBaseInfoSchema,
    updateLeadStatus,
    validLeadCountry,
    validLeadRegion,
    validLeadCity,
    updateTimeZone,
};