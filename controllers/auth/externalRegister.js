const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { User } = require("../../models/MainUser");
const {HttpError, ctrlWrapper, sendEmail} = require("../../helpers/index");
const crypto = require("node:crypto");
require("dotenv").config();


const {
    BASE_URL,
    ADMIN_EMAIL, 
    ADMIN_PASSWORD,
    MANAGER_EMAIL,
    MANAGER_PASSWORD,
    DEVELOPER_EMAIL,
    DEVELOPER_PASSWORD,
} = process.env;


const extrenalRegister = async(req, res) => {
    const {username, email, password} = req.body;
    const user = await User.findOne({email});
    let role;

    if(user){
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
        s: '250',
        r: 'g',
        d: 'identicon'
    });
    const verificationToken = crypto.randomUUID();


    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        role = 'Administrator';
    } else if (email === DEVELOPER_EMAIL && password === DEVELOPER_PASSWORD) {
        role = 'Developer';
    } else if (email === MANAGER_EMAIL && password === MANAGER_PASSWORD){
        role = 'Manager'
    } else {
        throw HttpError(400, "Invalid credentials");
    }


    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken, role });


    const verifyEmail = {
        to: email,
        subject: "New User Registered",
        html: `
        <p>The New User has been registered:</p>
        <ul>
            <li><strong>User Name:</strong> ${username}</li>
            <li><strong>User Email:</strong> ${email}</li>
        </ul>
        <p>If you agree, please <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>.</p>
        <p>Without email verification, a new user will not have access rights to the system or be able to log into it!</p>
        `
    }
    await sendEmail(verifyEmail);

    res.status(201).send({
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
    })
};


module.exports = {
    extrenalRegister: ctrlWrapper(extrenalRegister)
};