const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers/index");


const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegexp = /^[0-9()+\s-]+$/;


const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    lastName: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        required: [true, 'Set email for contact'],
    },
    phone: {
        type: String,
        required: [true, 'Set phone for contact'],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: false,
    },
    resource: {
        type: String,
        required: true,
    },
    newContact: {
        type: Boolean,
        default: true,
    },
    trading: {
        type: Boolean,
        default: false,
    },
    expirience: {
        type: String,
        enum: ['beginner', 'novice', 'intermediate', 'advanced', 'expert'],
        default: 'beginner',
    },
    investment: {
        type: String,
        enum: ['0-500', '500-2500', '2500-5000', '5000-10000', '10000+'],
        default: '0-500',
    },
    time:{
        type: String,
        enum: ['0-5', '5-10', '10-15', '15-20', '20+'], 
        default: '0-5',
    },
    riskTolerance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    profitGoal: {
        type: String,
        enum: ['conservative', 'moderate', 'aggressive'],
        default: 'conservative',
    }
}, {versionKey: false, timestamps: true});


contactSchema.post("save", handleMongooseError);


const addExternalContactSchema = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name must be at most 30 characters long.",
        "any.required": "Name is required.",
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        "string.min": "Last name must be at least 2 characters long.",
        "string.max": "Last name must be at most 30 characters long.",
        "any.required": "Last name is required.",
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
    phone: Joi.string().pattern(phoneRegexp).required().messages({
        "string.pattern.base": "Invalid phone number",
        "any.required": "phone number is required.",
    }),
    resource: Joi.string().required().messages({
        "resource": "Should show where the contact was created",
    }),
});


const addAdminPanelContactSchema = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name must be at most 30 characters long.",
        "any.required": "Name is required.",
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        "string.min": "Last name must be at least 2 characters long.",
        "string.max": "Last name must be at most 30 characters long.",
        "any.required": "Last name is required.",
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
    phone: Joi.string().pattern(phoneRegexp).required().messages({
        "string.pattern.base": "Invalid phone number",
        "any.required": "phone number is required.",
    }),
    resource: Joi.string().optional().messages({
        "resource": "Should show where the contact was created",
    }),
    trading: Joi.boolean().optional(),
    expirience: Joi.string().valid('beginner', 'novice', 'intermediate', 'advanced', 'expert').optional().messages({
        "any.only": "Invalid experience level.",
    }),
    investment: Joi.string().valid('0-500', '500-2500', '2500-5000', '5000-10000', '10000+').optional().messages({
        "any.only": "Invalid investment range.",
    }),
    time: Joi.string().valid('0-5', '5-10', '10-15', '15-20', '20+').optional().messages({
        "any.only": "Invalid time range.",
    }),
    riskTolerance: Joi.string().valid('low', 'medium', 'high').optional().messages({
        "any.only": "Invalid risk tolerance level.",
    }),
    profitGoal: Joi.string().valid('conservative', 'moderate', 'aggressive').optional().messages({
        "any.only": "Invalid profit goal.",
    }),
});


const updateSchema = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name must be at most 30 characters long.",
        "any.required": "Name is required.",
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
        "string.min": "Last name must be at least 2 characters long.",
        "string.max": "Last name must be at most 30 characters long.",
        "any.required": "Last name is required.",
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.pattern.base": "Invalid email address.",
        "any.required": "Email is required.",
    }),
    phone: Joi.string().pattern(phoneRegexp).required().messages({
        "string.pattern.base": "Invalid phone number",
        "any.required": "phone number is required.",
    }),
    resource: Joi.string().optional().messages({
        "resource": "Should show where the contact was created",
    }),
    trading: Joi.boolean().optional(),
    expirience: Joi.string().valid('beginner', 'novice', 'intermediate', 'advanced', 'expert').optional().messages({
        "any.only": "Invalid experience level.",
    }),
    investment: Joi.string().valid('0-500', '500-2500', '2500-5000', '5000-10000', '10000+').optional().messages({
        "any.only": "Invalid investment range.",
    }),
    time: Joi.string().valid('0-5', '5-10', '10-15', '15-20', '20+').optional().messages({
        "any.only": "Invalid time range.",
    }),
    riskTolerance: Joi.string().valid('low', 'medium', 'high').optional().messages({
        "any.only": "Invalid risk tolerance level.",
    }),
    profitGoal: Joi.string().valid('conservative', 'moderate', 'aggressive').optional().messages({
        "any.only": "Invalid profit goal.",
    }),
});


const updateNewContactSchema = Joi.object({
    newContact: Joi.boolean().required(),
});


const Contact = model("db-contacts", contactSchema);
const schemas = { 
    addExternalContactSchema, 
    addAdminPanelContactSchema, 
    updateSchema, 
    updateNewContactSchema,
};

module.exports = {Contact, schemas};