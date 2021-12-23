const Joi = require('@hapi/joi');
const wrapper = require('../../../helpers/utils/wrapper');
const { BadRequestError } = require('../../../helpers/error');

const validateInsertArticle = async (payload) => {
  const validSchema = Joi.object({
    id: Joi.number().required(),
    author: Joi.string().required(),
    title: Joi.string().required(),
    body: Joi.string().required(),
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};

const validateUpdateArticle = async (payload) => {
  const validSchema = Joi.object({
    id: Joi.number().required(),
    author: Joi.string().optional(),
    title: Joi.string().optional(),
    body: Joi.string().optional(),
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};

module.exports = {
  validateInsertArticle,
  validateUpdateArticle
};
