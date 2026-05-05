import Joi from "joi";

export const vaccineSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  recommendedAge: Joi.string().required(),
  boosterSchedule: Joi.string().optional(),
  isActive: Joi.bool().optional(),
}).required();

export const vaccineUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  description: Joi.string().optional(),
  recommendedAge: Joi.string().optional(),
  boosterSchedule: Joi.string().optional(),
  isActive: Joi.bool().optional(),
}).min(1);
