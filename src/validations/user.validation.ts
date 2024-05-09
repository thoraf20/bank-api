import { Request, Response } from "express";
import Joi from "joi";
import { emailPattern, passwordPattern } from "../utils";
import { User } from "../entity/user.entity";

export const RegistrationValidation = (req: Request) => {
  const requestSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().regex(emailPattern).required().error(new Error("Invalid email format")),
    password: Joi.string().regex(passwordPattern).min(8).required().error(new Error("Please match your password to the rules above for your enhanced security")
    ),
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error }
}

export const AccountVerificationValidation = (req: Request) => {
  const requestSchema = Joi.object({
    email: Joi.string().regex(emailPattern).required().error(new Error("Invalid email format")),
    code: Joi.string().required()
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error }
}

export const ForgotPasswordValidation = (req: Request) => {
  const requestSchema = Joi.object({
    email: Joi.string()
      .regex(emailPattern)
      .required()
      .error(new Error("Invalid email format")),
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const ResetPasswordValidation = (req: Request) => {
  const requestSchema = Joi.object({
    email: Joi.string().regex(emailPattern).required().error(new Error("Invalid email format")),
    code: Joi.string().required(),
    newPassword: Joi.string().regex(passwordPattern).min(8).required().error(new Error("Please match your password to the rules above for your enhanced security"))
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const SecurityPinValidation = (req: Request) => {
  const requestSchema = Joi.object({
    pin: Joi.string().length(4).required(),
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const LoginValidation = (req: Request) => {
  const requestSchema = Joi.object({
    email: Joi.string().regex(emailPattern).required().error(new Error("Invalid email format")),
    password: Joi.string().regex(passwordPattern).min(8).required().error(new Error("Password length must be minimum of 8 character and must contain at least one upper case letter, one number and one symbol"))
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const SetPinValidation = (req: Request) => {
  const requestSchema = Joi.object({
    pin: Joi.string().length(4),
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const UpdatePinValidation = (req: Request) => {
  const requestSchema = Joi.object({
    oldPin: Joi.string().length(4),
    newPin: Joi.string().length(4),
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};

export const UpdateUserDataValidation = (req: Request) => {
  const requestSchema = Joi.object({
    phoneNumber: Joi.string(),
    address: Joi.string(),
    dateOfBirth: Joi.string(),
    metadata: Joi.string()
  });

  const { value, error } = requestSchema.validate(req.body);

  return { value, error };
};
