const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
const {HttpError, ctrlWrapper} = require("../../helpers/index");
const jwt = require("jsonwebtoken");


const { SECRET_KEY } = process.env;


const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});


    if(!user){
        throw HttpError(401, "Email or Password invalid");
    }

    if(!user.verify) {
        throw HttpError(401, "Email is not verify")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw HttpError(401, "Email or Password invalid");
    }

   
    const payload = {id: user._id};
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, { token } );

    res.send({
        token,
        email: user.email,
        username: user.username,
        avatarURL: user.avatarURL,
        role: user.role,
    });
};


module.exports = {
    login: ctrlWrapper(login),
};