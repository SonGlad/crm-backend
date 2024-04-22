const { HttpError } = require("../helpers/index");
const { MainUserSchemas }  = require("../models/MainUser");
const { Office1UserSchemas }  = require("../models/Office1User");
const { Office2UserSchemas }  = require("../models/Office2User");
const validateBody = require("./validateBody");


const validUpdateUserInfoSchema = async (req, res, next) => {
    const {branch: authBranch} = req.auth;
    let schema;


    switch(authBranch){
        case 'Main':
            schema = MainUserSchemas.updateUserInfoSchema;
            break;
        case 'Office1':
            schema = Office1UserSchemas.updateUserInfoSchema;
            break;
        case 'Office2':
            schema = Office2UserSchemas.updateUserInfoSchema;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided"));
    };


    validateBody(schema)(req, res, next);
};


module.exports = validUpdateUserInfoSchema;