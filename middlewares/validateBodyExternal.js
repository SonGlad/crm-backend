const { HttpError } = require("../helpers/index");
const CryptoJS = require("crypto-js");

const { 
    NEURALINK_HEADER_KEY,
    NEURALINK_HEADER_DECRYPTION_KEY,
} = process.env;

const validateBodyExternal = (contactSchema)  => {
    const func = async (req, res, next) => {

        const headersKey = req.headers['header-key'];
        const decryptedHeadersKey = CryptoJS.AES.decrypt(headersKey, NEURALINK_HEADER_DECRYPTION_KEY);
        const originalHeadersKey = decryptedHeadersKey.toString(CryptoJS.enc.Utf8);

        if (originalHeadersKey !== NEURALINK_HEADER_KEY) {
            next (HttpError(401, "Unauthorized"));
        }

        if (!Object.keys(req.body).length) {
            next (HttpError(400, "All fields are empty"));
        };
    
        const { error } = contactSchema.validate(req.body);
        
        if (error) {
            next (HttpError(400, error.message));
        };
        next()
    }
    return func;
};


module.exports = validateBodyExternal;