const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers/index");


const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const userSchema = new Schema ({
    username: {
        type: String,
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Set password for the user"],
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        // required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: false,
        default: null,
    },
    role: {
        type: String,
        enum: ['CRM Manager', 'Retention Agent', 'Conversion Agent', 'Retention Manager', 'Conversion Manager'],
        default: null,
        required: [true, "User Role is Required"]
    },
    branch: {
        type: String,
        default: 'Office1',
        required: [true, "User branch is Required"]
    },
    createdBy: {
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String,
        userRole: String,
        userBranch: String,
    }

}, {versionKey:false, timestamps: true});


userSchema.post("save", handleMongooseError);


const registerSchema = Joi.object({
    username: Joi.string().min(2).max(30).required().messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name must be at most 30 characters long.",
        "any.required": "Name is required.",
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long.",
        "any.required": "Password is required.",
    }),
    role: Joi.string().required().messages({
        "any.required": "User Role is Required",
    }),
    branch: Joi.string().required().messages({
        "any.required": "User Branch is Required",
    })
});


const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
    password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long.",
        "any.required": "Password is required.",
    }),
});


const verifySchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
});


const userResetPasswordSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
});


const updateUserInfoSchema = Joi.object({
    password: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long.",
        "any.required": "Password is required.",
    }),
    newPassword: Joi.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long.",
        "any.required": "newPassword is required.",
    }),
});



const Office1UserSchemas = { 
    registerSchema, 
    loginSchema, 
    verifySchema, 
    userResetPasswordSchema,
    updateUserInfoSchema,
};
const Office1User = model("Office1_Users", userSchema);


module.exports = {Office1UserSchemas, Office1User};