const externalLead = require("./externalLead");
const leadAssign = require("./leadAssign");
const getAll = require("./getAll");
const addNewLead = require("./addNewLead");
const leadReAssign = require("./leadReAssign")
const getAllStatus = require("./getAllStatus")
const updateStatus = require("./updateStatus")
const changeBaseInfo = require("./changeBaseInfo");
const updateLeadCountry  = require("./updateLeadCountry"); 
const updateLeadCity = require("./updateLeadCity");
const updateLeadRegion = require("./updateLeadRegion");
const updateLeadComment = require("./updateLeadComment");
const updateLeadKYC = require("./updateLeadKYC");
// const getById = require("./getById");
// const deleteById = require("./deleteById");


module.exports = {
    externalLead,
    leadAssign,
    getAll,
    addNewLead,
    leadReAssign,
    changeBaseInfo,
    getAllStatus,
    updateStatus,
    updateLeadCountry,
    updateLeadCity,
    updateLeadRegion,
    updateLeadComment,
    updateLeadKYC,
    // getById,
    // deleteById,
};