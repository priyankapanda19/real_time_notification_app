const { celebrate, Joi, Segments } = require("celebrate");

const UserSchemaValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("admin", "moderator", "user").default("user"),
    }),
});

const LoginSchemaValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
});

module.exports = {
    UserSchemaValidation,
    LoginSchemaValidation,
};
