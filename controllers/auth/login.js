const bcrypt = require("bcryptjs");
const { User } = require("../../models/MainUser");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { HttpError, ctrlWrapper } = require("../../helpers/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const { SECRET_KEY } = process.env;


const login = async(req, res) => {
    const {email, password} = req.body;
    let user;

    user = await User.findOne({email});
    if(user){
        await loginUser(res, user, User, password);
        return;
    }

    user = await Office1User.findOne({ email });
    if (user) {
        await loginUser(res, user, Office1User, password);
        return;
    }

    user = await Office2User.findOne({ email });
    if (user) {
        await loginUser(res, user, Office2User, password);
        return;
    }

    throw HttpError(401, "Email or Password invalid");
};


const loginUser = async (res, user, userModel, password) => {
    if (!user.verify) {
        throw HttpError(401, "Email is not verified");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or Password invalid");
    }


    const payload = {
        id: user._id,
        role: user.role,
        branch: user.branch
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await userModel.findByIdAndUpdate(user._id, { token } );

    res.send({
        token,
        username: user.username,
        avatarURL: user.avatarURL,
        role: user.role,
        branch: user.branch,
        email: user.email,
    });
};


module.exports = {
    login: ctrlWrapper(login),
};