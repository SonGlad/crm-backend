const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers/index");


const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegexp = /^[0-9()+\s-]+$/;


const leadsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for lead'],
    },
    lastName: {
        type: String,
        required: [true, 'Set name for lead'],
    },
    email: {
        type: String,
        required: [true, 'Set email for lead'],
    },
    phone: {
        type: String,
        required: [true, 'Set phone for lead'],
    },
    resource: {
        type: String,
        required: true,
    },
    newContact: {
        type: Boolean,
        default: true,
        required: false,
    },
    assigned: {
        type: Boolean,
        default: false,
    },
    assignedOffice: {
        type: String,
        enum: ['Office1', 'Office2', 'Not Assigned'],
        require: false,
        default: 'Not Assigned',
    },
    crmManager: {
        name: {
            type: String,
            required: [false, 'Set CRM Manager Name for lead'],
            default: '',
        },
        email: {
            type: String,
            required: false,
            default: '',
        }
    },
    conManager: {
        name: {
            type: String,
            required: false,
            default: '',
        },
        email: {
            type: String,
            required: false,
            default: '',
        }
    },
    conAgent: {
        name: {
            type: String,
            required: false,
            default: '',
        },
        email: {
            type: String,
            required: false,
            default: '',
        }
    },
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
    assignedOffice: Joi.string().optional().messages({
        "any.required": "Assigned Office is requiered",
    }),
});


const Leads = model("external_leads", leadsSchema);
const externalLeadsSchemas = { 
    addExternalLeadSchema,
};


module.exports = {Leads, externalLeadsSchemas};