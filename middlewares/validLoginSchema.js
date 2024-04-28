const { HttpError } = require("../helpers/index");
const { User, MainUserSchemas }  = require("../models/MainUser");
const { Office1User, Office1UserSchemas }  = require("../models/Office1User");
const { Office2User, Office2UserSchemas }  = require("../models/Office2User");
const validateBody = require("./validateBody");


const validLoginSchema = async(req, res, next) => {
    const { email } = req.body;
    let user;
    let schema;


    user = await User.findOne({email});
    if(user){
        schema = MainUserSchemas.loginSchema;
    };


    user = await Office1User.findOne({email});
    if (user) {
        schema = Office1UserSchemas.loginSchema;
    };


    user = await Office2User.findOne({email});
    if (user) {
        schema = Office2UserSchemas.loginSchema;
    };
    

    try {
        if (schema) {
            validateBody(schema)(req, res, next);
        } else {
            throw HttpError(401, "User Email not found");
        }
    } catch (error) {
        next(error);
    }
};


module.exports = validLoginSchema;