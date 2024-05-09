import { RequestHandler } from "express";
import httpStatus from "http-status-codes";
import { AccountVerificationValidation, ForgotPasswordValidation, LoginValidation, RegistrationValidation, ResetPasswordValidation } from "../validations/user.validation";
import { User } from "../entity/user.entity";
import { APIError, comparePassword, generateAccessToken, hashPassword } from "../utils";
import UserService from "../services/user.service";

export const registerHandler: RequestHandler = async(req, res, next) => {

  const {error, value} = RegistrationValidation(req)

  if (error) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: error.message }));
  }

  const userExist = await User.findOne({ where: { email: value.email } })

  if (userExist) {
    return next(new APIError({
        status: httpStatus.CONFLICT,
        code: 90,
        message: `user with email ${value.email} already exist`,
      })
    );
  }

  const passwordHash = hashPassword(value.password);

  const newUser = new User()
  newUser.email = value.email
  newUser.password = passwordHash
  newUser.firstName = value.firstName
  newUser.lastName = value.lastName;

  await newUser.save()

  newUser.password = ""

  return res.status(httpStatus.CREATED).json({
    status: "success",
    message: "User added successfully. Use 1234 to verify your email",
    data: newUser,
  });
}
export const verifyUserAccountHandler: RequestHandler = async(req, res, next) => {

  const { error, value } = AccountVerificationValidation(req);

  if (error) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: error.message }));
  }

  const userExist = await UserService.getUserByEmail(value.email);

  if (userExist) {
    return next(new APIError({
        status: httpStatus.CONFLICT,
        code: 90,
        message: `user with email ${value.email} already exist`,
      })
    );
  }

  if (value.code != '1234') {
    return next(new APIError({
        status: httpStatus.BAD_REQUEST,
        code: 90,
        message: `invalid verification code`,
      })
    );
  }

  await User.update({email: value.email}, { isEmailVerified: true, isActive: true })

  return res.status(httpStatus.CREATED).json({
    status: "success",
    message: "account successfully verified",
  });
}
export const forgotPasswordHandler: RequestHandler = async(req, res, next) => {

  const { error, value } = ForgotPasswordValidation(req)

  if (error) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: error.message }));
  }

  const dbUser = await UserService.getUserByEmail(value.email);

  if (!dbUser) {
    return next(new APIError({ status: httpStatus.NOT_FOUND, message: 'user not found' }));
  }  

  return res.status(httpStatus.CREATED).json({
    status: "success",
    message: `use ${1234} as the verification code.`,
  });
}
export const resetPasswordHandler: RequestHandler = async(req, res, next) => {
  const { error, value } = ResetPasswordValidation(req)

  if (error) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: error.message }));
  }

  const dbUser = await UserService.getUserByEmail(value.email);

  if (!dbUser) {
    return next(new APIError({ status: httpStatus.NOT_FOUND, message: 'user not found' }));
  }

  if (value.code !== '1234') {
    return next(new APIError({
        status: httpStatus.BAD_REQUEST,
        code: 90,
        message: `invalid verification code`,
      })
    );
  }

  try {
    const passwordHash = hashPassword(value.newPassword);

    await User.update({ email: value.email }, { password: passwordHash });

    return res.status(httpStatus.CREATED).json({
      status: "success",
      message: `password reset successful.`,
    });
  } catch (error) {
    return next(new APIError({ status: httpStatus.INTERNAL_SERVER_ERROR, message: 'an error occurred' }));
  }
}

export const loginHandler: RequestHandler = async(req, res, next) => {
  const { error, value } = LoginValidation(req)

  if (error) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: error.message }));
  }

  const dbUser = await UserService.getUserByEmail(value.email);

  if (!dbUser || !comparePassword(value.password, dbUser?.password)) {
    return next(new APIError({ status: httpStatus.BAD_REQUEST, message: 'invalid credentials' }));
  }

  try {
     const payload = {
       id: dbUser.id,
       email: dbUser.email,
     };

     const token = generateAccessToken(payload);

     return res.status(httpStatus.OK).json({
       message: "login successful",
       accessToken: token,
     });
  } catch (error) {
      return next(new APIError({ status: httpStatus.INTERNAL_SERVER_ERROR, message: 'an error occurred' }));
  }
}