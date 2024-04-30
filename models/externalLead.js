const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers/index");


const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegexp = /^[0-9()+\s-]+$/;


const leadsSchema = new Schema({
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
    resource: {
        type: String,
        required: true,
    },
    newContact: {
        type: Boolean,
        default: true,
    }
}, {versionKey: false, timestamps: true});


leadsSchema.post("save", handleMongooseError);


const addExternalLeadSchema = Joi.object({
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


const updateNewLeadSchema = Joi.object({
    newContact: Joi.boolean().required(),
});


const Leads = model("external_leads", leadsSchema);
const externalLeadsSchemas = { 
    addExternalLeadSchema,
    updateNewLeadSchema,
};


module.exports = {Leads, externalLeadsSchemas};