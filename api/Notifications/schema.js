const { celebrate, Joi, Segments } = require("celebrate");

const NotificationSchemaValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        message: Joi.string().required(),
        recipient: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .when("recipientRole", {
                is: Joi.exist(),
                then: Joi.optional(),
                otherwise: Joi.required(),
            }),
        recipientRole: Joi.string()
            .valid("admin", "moderator", "user")
            .optional(),
    }),
});

module.exports = {
    NotificationSchemaValidation,
};
