const Joi = require('joi');

const mobSchema = Joi.object({
  name: Joi.string().required(),
});

const memberSchema = Joi.object({
  name: Joi.string().required(),
  height: Joi.number().min(0).required(),
});

const validateMob = obj => {
  return mobSchema.validate(obj);
};

const validateMember = obj => {
  return memberSchema.validate(obj);
};

module.exports = {
  validateMob,
  validateMember,
};
