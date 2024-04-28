const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { ctrlWrapper, HttpError } = require("../../helpers/index");


const getUserById = async(req, res) => {
    const { userId } = req.params;
    const { branch: reqBranch } = req.body;
    const {role, branch} = req.user;
    const {role: authRole, branch: authBranch} = req.auth;

    
    if (authRole !== role || authBranch !== branch) {
        return res.status(403).send({ message: 'Forbidden: Access denied' });
    };


    let user;


    switch(authBranch){
        case "Main":
            switch (reqBranch) {
                case 'Office1':
                    user = await Office1User.findOne({ _id: userId})
                    .select("-password -token -avatarURL -verificationToken");
                    break;
                case 'Office2':
                    user = await Office2User.findOne({ _id: userId})
                    .select("-password -token -avatarURL -verificationToken");
                    break;
                default:
                    return res.status(400).send({ message: 'Invalid branch specified' });
            };
            break;
        case "Office1":
            user = await Office1User.findOne({ _id: userId})
            .select("-password -token -avatarURL -verificationToken");
            break;
        case "Office2":
            user = await Office2User.findOne({ _id: userId})
            .select("-password -token -avatarURL -verificationToken");
            break;
        default: 
            return res.status(400).send({ message: 'Authorization branch is invalid' });
    };


    if(!user) {
        throw HttpError(404, "User was not found");
    };


    res.status(200).send(user);
};


module.exports ={
    getUserById: ctrlWrapper(getUserById)
};

