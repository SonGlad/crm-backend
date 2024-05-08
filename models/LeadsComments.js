const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers/index");


const commentsSchema = new Schema({
    ownerLeadId_office1: {
        type: Schema.Types.ObjectId,
        ref: "office1_leads",
        required: false,
    },
    ownerLeadId_office2: {
        type: Schema.Types.ObjectId,
        ref: "office2_leads",
        required: false,
    },
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
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        required: false
    },

}, {versionKey: false, timestamps: true});


commentsSchema.post("save", handleMongooseError);


const addCommentSchema = Joi.object({
    // ownerLeadId_office1: Joi.string().optional().messages({
    //     "any.only": "Id of owner lead is required."
    // }),
    // ownerLeadId_office2: Joi.string().optional().messages({
    //     "any.only": "Id of owner lead is required."
    // }),
    // createdBy: Joi.object({
    //     username: Joi.string().optional().allow('').messages({
    //         "any.required": "User Name is required.",
    //     }),
    //     email: Joi.string().email().optional().allow('').messages({
    //         "any.required": "User Email is required.",
    //     }),
    //     role: Joi.string().optional().allow('').messages({
    //         "any.required": "User Role is required.",
    //     }),
    //     branch: Joi.string().optional().allow('').messages({
    //         "any.required": "User Branch is required.",
    //     }),
    // }),
    // createdAt: Joi.date().default(Date.now()).optional().allow('').messages({
    //     "any.required": "Date is required.",
    // }),
    // comment: Joi.string().optional().allow('').messages({
    //     "any.required": "Comment is required.",
    // }),
});


const AllCommentsSchema = model("leads_comments", commentsSchema);
const schemaForComments = {
    addCommentSchema,
};


module.exports = {AllCommentsSchema, schemaForComments};




