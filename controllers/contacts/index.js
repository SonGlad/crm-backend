const getAll = require("./getAll");
const getAllByResource = require("./getAllByResouce");
const getById = require("./getById");
const addNewContact = require("./addNewContact");
const externalContact = require("./externalContact")
const updateById = require("./updateById");
const deleteById = require("./deleteById");
const updateNewContactById = require("./updateNewContactById")


module.exports = {
    getAll,
    getAllByResource,
    getById,
    addNewContact,
    externalContact,
    updateById,
    deleteById,
    updateNewContactById,
};