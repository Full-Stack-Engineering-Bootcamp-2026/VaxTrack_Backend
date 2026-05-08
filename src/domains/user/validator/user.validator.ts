import Joi from "joi";

export const registerUserSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().optional(),
  phone: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
}).min(1);

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

export const createStaffSchema = Joi.object({
  fullName: Joi.string().required(),

  email: Joi.string().email().required(),

  phone: Joi.string().required(),
});