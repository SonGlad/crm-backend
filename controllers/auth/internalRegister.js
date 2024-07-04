const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { User } = require("../../models/MainUser")
const { Office1User } = require("../../models/Office1User");
const { Office2User } = require("../../models/Office2User");
const { HttpError, ctrlWrapper, sendEmail } = require("../../helpers/index");
const crypto = require("node:crypto");
require("dotenv").config();


const { BASE_URL, ADMIN_EMAIL } = process.env;


const internalRegister = async (req, res, next) => {
    const { username, email, password, role, branch } = req.body;
    const {role: authRole, branch: authBranch} = req.auth;
    const { _id: owner, role: creatorRole, branch: creatorBranch, username: creatorName } = req.user;
    const forMail = {username, role, email, branch};


    if (!username || !email || !password || !role || !branch) {
        throw HttpError(400, "All fields (username, email, password, role, branch) are required");
    };


    // Определение доступных ролей для регистрации в зависимости от роли того, кто регистрирует
    let availableRoles = [];
    switch (authRole) {
        case 'Developer':
            availableRoles = ['Conversion Agent', 'Retention Agent', 'Conversion Manager', 'Retention Manager', 'CRM Manager', 'Manager', 'Administrator', 'Developer'];
            break;
        case 'Administrator':
            availableRoles = ['Conversion Agent', 'Retention Agent', 'Conversion Manager', 'Retention Manager', 'CRM Manager', 'Manager', 'Administrator'];
            break;
        case 'Manager':
            availableRoles = ['Conversion Agent', 'Retention Agent', 'Conversion Manager', 'Retention Manager', 'CRM Manager', 'Manager'];
            break;
        case 'CRM Manager':
            availableRoles = ['Conversion Agent', 'Retention Agent', 'Conversion Manager', 'Retention Manager'];
            break;
        case 'Retention Manager':
            availableRoles = ['Retention Agent'];
            break;
        case 'Conversion Manager':
            availableRoles = ['Conversion Agent'];
            break;
        default:
            throw HttpError(403, "You are not authorized to register new users");
    };


    // Проверка доступности выбранной роли для регистрации
    if (!availableRoles.includes(role)) {
        throw HttpError(403, `You are not authorized to register a user with role "${role}"`);
    };

   
    // Проверка отсутствия пользователя с таким email в базе данных
    const userExists = await User.findOne({email}) || 
    await Office1User.findOne({email}) || 
    await Office2User.findOne({email});


    if (userExists) {
        throw HttpError(409, "Email already in use");
    };


     // Проверка отсутствия пользователя с ролью "CRM Manager" в базе данных
    let CrmManagerExists;
    switch(branch){
        case "Office1":
            CrmManagerExists = await Office1User.findOne({role: "CRM Manager"});
            if(CrmManagerExists.role === role){
                throw HttpError(409, "You are allowed to create only 1 CRM Manager per Office");
            }
            break;
        case "Office2":
            CrmManagerExists = await Office2User.findOne({role: "CRM Manager"});
            if(CrmManagerExists.role === role){
                throw HttpError(409, "You are allowed to create only 1 CRM Manager per Office");
            }
            break;
        default:
            throw new HttpError(400, "Unknown branch specified");
    };


    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
        s: '250',
        r: 'g',
        d: 'identicon'
    });
    const verificationToken = crypto.randomUUID();


    // Создание нового пользователя
    let newUser;
    const createdBy = {
        ownerId: owner,
        userName: creatorName, 
        userRole: creatorRole,
        userBranch: creatorBranch, 
    };
   

    if (authRole !== creatorRole || authBranch !== creatorBranch) {
        throw HttpError(403, "Unauthorized. You have no rights for this type of action");
    };


    switch (branch) {
        case 'Main':
            newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken, createdBy });
            break;
        case 'Office2':
            newUser = await Office2User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken, createdBy });
            break;
        case 'Office1':
            newUser = await Office1User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken, createdBy });
            break;
        default:
            throw HttpError(400, "Invalid branch provided");
    };


    // Отправка письма с подтверждением регистрации
    const verifyEmail = {
        to: ADMIN_EMAIL,
        subject: "New User Registered",
        html: `
        <p>The New User has been registered:</p>
        <ul>
            <li><strong>User Name:</strong> ${forMail.username}</li>
            <li><strong>User Email:</strong> ${forMail.email}</li>
            <li><strong>User Role:</strong> ${forMail.role}</li>
            <li><strong>User Assigned Branch:</strong> ${forMail.branch}</li>
        </ul>
        <p>The New User was created by:</p>
        <ul>
            <li><strong>User Name:</strong> ${creatorName}</li>
            <li><strong>User Role:</strong> ${creatorRole}</li>
            <li><strong>User Branch:</strong> ${creatorBranch}</li>
        </ul>
        <p>If you agree, please <a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>.</p>
        <p>Without email verification, a new user will not have access rights to the system or be able to log into it!</p>
        `
    };
    await sendEmail(verifyEmail);
    

    // Ответ с информацией о созданном пользователе
    res.status(201).send({
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        branch: newUser.branch,
        password: password
    });
};

module.exports = {
    internalRegister: ctrlWrapper(internalRegister)
};