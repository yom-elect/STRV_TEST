import Joi from 'joi';

export default {
  contactCreate: Joi.object().keys({
    firstName: Joi.string().required().max(500),
    address: Joi.string().required().min(3).max(2000),
    lastName: Joi.string().required().max(500),
    phoneNumber: Joi.string().required().max(15),
  }),
};
