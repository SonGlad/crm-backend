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
    branch: {
        type: String,
        default: 'Office1',
        required: false,
    },
    role: {
        type: String,
        enum: ['CRM Manager', 'Conversion Manager', 'Conversion Agent'],
        default: "CRM Manager",
        required: false,
    },
    managerId: {
        type: Schema.Types.ObjectId,
        ref: "Office1_Users",
        required: false,
    },
    conManagerId: {
        type: Schema.Types.ObjectId,
        ref: "Office1_Users",
        required: false,
    },
    conAgentId: {
        type: Schema.Types.ObjectId,
        ref: "Office1_Users",
        required: false,
    },
    externalLeadId: {
        type: Schema.Types.ObjectId,
        ref: "external_leads",
        required: false,
    },
    assigned: {
        type: Boolean,
        default: false,
        required: false,
    },
    selfCreated: {
        type: Boolean,
        default: false,
        required: false,
    },
    clientId: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        enum: ['New', 'N/A', 'Wrong Number', 'Wrong Person', 
        'Potential', 'Not Interested', 'In the Money', 
        'Call Back 1', 'Call Back 2', 'Call Back 3', 
        'Not Potential', 'Reassign', 'Never Answer'],
        default: 'New',
        required: false
    },
    country: {
        type: String,
        default: '',
        required: false
    },
    region: {
        type: String,
        default: '',
        required: false
    },
    city: {
        type: String,
        default: '',
        required: false
    },
    timeZone: {
        type: Number,
        enum: [-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 
        +1, +2, +3, +4, +5, +6, +7, +8, +9, +10, +11, +12],
        default: 0,
        required: false
    },
    KYC: {
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
    }, 
    latestComment: {
        createdBy: {
            username: {
                type: String,
                required: false
            },
            email: {
                type: String,
                required: false
            },
            role:{
                type: String,
                required: false
            },
            branch: {
                type: String,
                required: false
            }
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        comment: {
            type: String,
            required: false
        },
    }

}, {versionKey: false, timestamps: true});


leadsSchema.post("save", handleMongooseError);


const addOffice1LeadSchema = Joi.object({
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
    branch: Joi.string().required().messages({
        "string.pattern.base": "Invalid branch provided.",
        "any.required": "Branch is required.",
    }),
    role: Joi.string().valid('CRM Manager', 'Conversion Manager', 'Conversion Agent').optional().messages({
        "any.only": "Invalid role provided."
    }),
    managerId: Joi.string().optional().messages({
        "any.only": "Invalid managerId provided."
    }),
    conManagerId: Joi.string().optional().messages({
        "any.only": "Invalid managerId provided."
    }),
    conAgentId: Joi.string().optional().messages({
        "any.only": "Invalid managerId provided."
    }),
    externalLeadId: Joi.string().optional().messages({
        "any.only": "External Lead Id is required."
    }),
    assigned: Joi.boolean().optional(),
    selfCreated: Joi.boolean().optional(),
    clientId: Joi.number().optional().messages({
        "any.only": "Invalid id provided."
    }),
    status: Joi.string().optional().valid(
    'New', 'N/A', 'Wrong Number', 'Wrong Person', 
    'Potential', 'Not Interested', 'In the Money', 
    'Call Back 1', 'Call Back 2', 'Call Back 3', 
    'Not Potential', 'Reassign', 'Never Answer').messages({
        "any.only": "Invalid status provided."
    }),
    country: Joi.string().optional().messages({
        "any.only": "Invalid country provided."
    }),
    region: Joi.string().optional().messages({
        "any.only": "Invalid region provided."
    }),
    city: Joi.string().optional().messages({
        "any.only": "Invalid city provided."
    }),
    timeZone: Joi.number().valid(-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 
        +1, +2, +3, +4, +5, +6, +7, +8, +9, +10, +11, +12).optional().messages({
        "any.only": "Invalid time zone provided."
    }),
    KYC: Joi.object({
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
    }).optional().messages({
        "any.only": "Invalid KYC."
    }),
    latesComment: Joi.object({
        createdBy: Joi.object({
            username: Joi.string().optional(),
            email: Joi.string().email().optional(),
            role: Joi.string().optional(),
            branch: Joi.string().optional()
        }),
        createdAt: Joi.date().default(Date.now()).optional(),
        comment: Joi.string().optional()
    }).messages({"any.only": "Comment is required."}),

});


const office1ConManagerSchema = Joi.object({
    conManagerId: Joi.string().optional().messages({
        "any.only": "Invalid managerId provided."
    }),
});


const office1ConAgentSchema = Joi.object({
    conAgentId: Joi.string().optional().messages({
        "any.only": "Invalid managerId provided."
    }),
});



const Office1Leads = model("office1_leads", leadsSchema);
const Office1Schemas = { 
    addOffice1LeadSchema,
    office1ConManagerSchema,
    office1ConAgentSchema,
};


module.exports = {Office1Leads, Office1Schemas};