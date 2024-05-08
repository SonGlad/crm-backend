const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/index");
const { User } = require("../models/MainUser");
const { Office1User }  = require("../models/Office1User");
const { Office2User }  = require("../models/Office2User");


const { SECRET_KEY } = process.env;


const authenticate = async (req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");


    if(bearer !== "Bearer" || !token) {
        next (HttpError(401));
    } 


    try {
        const { id, role, branch } = jwt.verify(token, SECRET_KEY);
        let user;

        switch (branch) {
            case 'Main':
                if (['Administrator', 'Manager', 'Developer'].includes(role)) {
                    user = await User.findById(id);
                }
                break;
            case 'Office1':
                if (['CRM Manager', 'Retention Agent', 'Conversion Agent', 'Retention Manager', 'Conversion Manager'].includes(role)) {
                    user = await Office1User.findById(id);
                }
                break;
            case 'Office2':
                if (['CRM Manager', 'Retention Agent', 'Conversion Agent', 'Retention Manager', 'Conversion Manager'].includes(role)) {
                    user = await Office2User.findById(id);
                }
                break;
            default:
                next(HttpError(401));
                return;
        };

        
        if (user && user.token === token) {
            req.user = user;
            req.auth = { id, role, branch };
            return next();
        } else {
            return next(HttpError(401));
        };
        

    } catch (error) {
        return next(HttpError(401));
    };
};


module.exports = authenticate;