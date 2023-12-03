// ------------------------------------------------------------------------------
// Schema Validation, Joi

import Joi from "joi";

const productSchemaValidation = Joi.object({
    productName: Joi.string().required().trim(),
    productContent: Joi.string().required().trim(),
    price: Joi.number().required(),
    status: Joi.string().valid("FOR_SALE", "SOLD_OUT").trim(),
});

const userSchemaValidation = Joi.object({
    email: Joi.string().required().trim(),
    password: Joi.string().min(6).required().trim(),
    username: Joi.string().required().trim(),
    confirmPassword: Joi.ref("password"),
});

const userLoginSchemaValidation = Joi.object({
    email: Joi.string().required().trim(),
    password: Joi.string().min(6).required().trim(),
});

export {
    productSchemaValidation,
    userSchemaValidation,
    userLoginSchemaValidation,
};
