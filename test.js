const Joi = require("joi");
const schema = Joi.object({
  username: Joi.string().min(3).max(30),
  password: Joi.number().integer().min(10).max(100),
});
const { error, value } = schema.validate({ username: "zsss", password: "45" });
console.log(error);
