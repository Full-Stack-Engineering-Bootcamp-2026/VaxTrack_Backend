import Joi from "joi";

export const recordVaccinationSchema = Joi.object({
  administeredDate: Joi.date().required(),
  batchNumber: Joi.string().required(),
  clinicalNotes: Joi.string().optional(),
});

export const updateVaccinationSchema = Joi.object({
  administeredDate: Joi.date(),
  batchNumber: Joi.string(),
  clinicalNotes: Joi.string(),
}).min(1);