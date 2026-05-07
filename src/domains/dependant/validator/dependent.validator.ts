import Joi from "joi";
import { Gender, Relationship } from "../entities/dependent.entity";

export const createDependentSchema = Joi.object({
    fullName: Joi.string().required(),

    dateOfBirth: Joi.date().required(),

    gender: Joi.string()
        .valid(...Object.values(Gender))
        .required(),

    relationship: Joi.string()
        .valid(...Object.values(Relationship))
        .required(),

    notes: Joi.string().required(),
});

export const updateDependentSchema = Joi.object({
    fullName: Joi.string(),

    dateOfBirth: Joi.date(),

    gender: Joi.string().valid(...Object.values(Gender)),

    relationship: Joi.string().valid(...Object.values(Relationship)),

    notes: Joi.string(),
}).min(1);