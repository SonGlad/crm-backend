const {ctrlWrapper, HttpError, sendEmail} = require("../../helpers/index");
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
require("dotenv").config();


const {BASE_URL} = process.env;


const resendUserVerifyEmail = async(req, res) => {
    const { userId } = req.params;
    const { branch, email } = req.body;
    const {role: userRole, branch: userBranch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;


    if (authRole !== userRole || authBranch !== userBranch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let user;
    

    switch(authBranch){
        case "Main":
            switch(branch){
                case "Office1":
                    user = await Office1User.findOne({ _id: userId});
                    break;
                case "Office2":
                    user = await Office2User.findOne({ _id: userId});
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' }); 
            };
            break;
        case "Office1":
            user = await Office1User.findOne({ _id: userId});
            break;
        case "Office2":
            user = await Office2User.findOne({ _id: userId});
            break;
        default: 
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if(!user) {
        throw HttpError(404, "User was not found");
    };


    if(user.verify){
        throw HttpError(400, "Verification has already been passed");
    };


    const verifyEmail = {
        to: email,
        subject: "Resending New User Email Verification",
        html: `
        <p>This email has been sent because the new registered user did not receive the email 
            confirmation for successful verification of their email, or the previous email was deleted, 
            or the user did not complete the email verification process.
        </p>
        <p>The New User Data:</p>
        <ul>
            <li><strong>User Name:</strong> ${user.username}</li>
            <li><strong>User Email:</strong> ${user.email}</li>
            <li><strong>User Role:</strong> ${user.role}</li>
            <li><strong>User Assigned Branch:</strong> ${user.branch}</li>
        </ul>
        <p>The User was created by:</p>
        <ul>
            <li><strong>User Name:</strong> ${user.createdBy.userName}</li>
            <li><strong>User Role:</strong> ${user.createdBy.userRole}</li>
            <li><strong>User Branch:</strong> ${user.createdBy.userBranch}</li>
        </ul>
        <p>If you agree, please <a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click here to verify email</a>.</p>
        <p>Without email verification, a new user will not have access rights to the system or be able to log into it!</p>
        `
    }
    await sendEmail(verifyEmail);


    res.status(200).send({message: "Verify email send"});
};


module.exports = {
    resendUserVerifyEmail: ctrlWrapper(resendUserVerifyEmail)
};