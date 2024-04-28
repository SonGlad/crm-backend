const { HttpError } = require("../helpers/index");
const { MainUserSchemas }  = require("../models/MainUser");
const { Office1UserSchemas }  = require("../models/Office1User");
const { Office2UserSchemas }  = require("../models/Office2User");
const validateBody = require("./validateBody");


const validVerifySchema = async (req, res, next) => {
    const { branch: authBranch } = req.auth;
    const { branch: reqBranch } = req.body;


    let schema;


    switch(authBranch){
        case 'Main':
            switch(reqBranch){
                case "Main":
                    schema = MainUserSchemas.verifySchema;
                    break;
                case "Office1":
                    schema = Office1UserSchemas.verifySchema;
                    break;
                case "Office2":
                    schema = Office2UserSchemas.verifySchema;
                    break;
                default:
                    return next(HttpError(400, "Invalid branch provided")); 
            }
            break;
        case 'Office1':
            schema = Office1UserSchemas.verifySchema;
            break;
        case 'Office2':
            schema = Office2UserSchemas.verifySchema;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided"));
    };


    validateBody(schema)(req, res, next);
};


module.exports = validVerifySchema ;