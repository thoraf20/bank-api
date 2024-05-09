import { RequestHandler } from "express";
import httpStatus from "http-status-codes";
import { SetPinValidation, UpdatePinValidation, UpdateUserDataValidation } from "../validations/user.validation";
import { APIError, comparePassword, hashPassword } from "../utils";
import UserService from "../services/user.service";
import { User } from "../entity/user.entity";
export const setPinHandler: RequestHandler = async (req, res, next) => {
  const { error, value } = SetPinValidation(req);

  if (error) {
    return next(
      new APIError({ status: httpStatus.BAD_REQUEST, message: error.message })
    );
  }

  const user = await UserService.getCurrentUser(res);

  if (!user) {
    return next(
      new APIError({ status: httpStatus.NOT_FOUND, message: "user not found" })
    );
  }

  const pinHash = hashPassword(value.pin);

  await User.update({ id: user.id }, { pin: pinHash });

  return res.status(httpStatus.OK).json({
    message: "pin set successful",
  });
};

export const updatePinHandler: RequestHandler = async (req, res, next) => {
  const { error, value } = UpdatePinValidation(req);

  if (error) {
    return next(
      new APIError({ status: httpStatus.BAD_REQUEST, message: error.message })
    );
  }

  const user = await UserService.getCurrentUser(res);

  if (!user) {
    return next(
      new APIError({ status: httpStatus.NOT_FOUND, message: "user not found" })
    );
  }

  if (!comparePassword(value.oldPin, user?.pin)) {
    return next(
      new APIError({ status: httpStatus.BAD_REQUEST, message: "invalid old pin" })
    );
  }

  try {
    const pinHash = hashPassword(value.newPin);

    await User.update({ id: user.id }, { pin: pinHash });

    return res.status(httpStatus.OK).json({
      message: "pin updated successful",
    });
  } catch (error) {
    return next(
      new APIError({ 
        status: httpStatus.INTERNAL_SERVER_ERROR, 
        message: "an error occurred" 
      })
    );
  }
};

export const updateUserDataHandler: RequestHandler = async (req, res, next) => {
  const { error, value } = UpdateUserDataValidation(req);

  if (error) {
    return next(
      new APIError({ status: httpStatus.BAD_REQUEST, message: error.message })
    );
  }

  const user = await UserService.getCurrentUser(res);

  if (!user) {
    return next(
      new APIError({ status: httpStatus.NOT_FOUND, message: "user not found" })
    );
  }

  try {
    await User.update({ id: user.id }, { ...value })

    return res.status(httpStatus.OK).json({
      message: "user data updated successful",
    });
  } catch (error) {
    return next(
      new APIError({ 
        status: httpStatus.INTERNAL_SERVER_ERROR, 
        message: "an error occurred" 
      })
    );
  }
}