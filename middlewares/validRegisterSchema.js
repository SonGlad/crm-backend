const { HttpError } = require("../helpers/index");
const { MainUserSchemas } =require("../models/MainUser");
const { Office1UserSchemas }  = require("../models/Office1User");
const { Office2UserSchemas }  = require("../models/Office2User");
const validateBody = require("./validateBody");


const validRegisterSchema = async (req, res, next) => {
    const {branch: authBranch} = req.auth;
    const { role, branch } = req.body;


    let schema;
    

    if (!role || !branch) {
        return next(HttpError(400, "Both role and branch must be provided"));
    }


    switch (authBranch) {
        case "Main":
            switch (branch) {
                case "Main":
                    schema = MainUserSchemas.registerSchema;
                    break;
                case "Office1":
                    schema = Office1UserSchemas.registerSchema;
                    break;
                case "Office2":
                    schema = Office2UserSchemas.registerSchema;
                    break;
                default:
                    return next(HttpError(400, "Invalid branch provided"));
            }
            break;
        case "Office1":
            if (branch !== "Office1") {
                return next(HttpError(403, "Unauthorized branch for Office1 user"));
            }
            schema = Office1UserSchemas.registerSchema;
            break;
        case "Office2":
            if (branch !== "Office2") {
                return next(HttpError(403, "Unauthorized branch for Office2 user"));
            }
            schema = Office2UserSchemas.registerSchema;
            break;
        default:
            return next(HttpError(400, "Invalid branch provided in auth token"));
    }


    validateBody(schema)(req, res, next);
};

module.exports = validRegisterSchema;