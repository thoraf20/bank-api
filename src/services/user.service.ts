import { NextFunction, Response } from "express";
import { User } from "../entity/user.entity";
import { APIError } from "../utils";
import httpStatus from "http-status-codes";


export default class UserService {
  static getCurrentUser = async (res: Response): Promise<User | null> => {
    return User.findOne({ where: { id: res.locals.user.id } });
  };

  static getUserByEmail = async (email: string): Promise<User | null> => {
    return User.findOne({ where: { email } });
  };

  static getUserByPhone = async (phone: string): Promise<User | null> => {
    return User.findOne({ where: { phoneNumber: phone } });
  };

  static getUserById = async (id: string): Promise<User | null> => {
    return User.findOne({ where: { id } });
  };

  static checkUserExist = async (email: string, next: NextFunction): Promise<User> => {
    const user = await User.findOne({ where: { email }, select: ['password'] });

    if (!user) {
      throw next(
        new APIError({
          status: httpStatus.NOT_FOUND,
          code: 90,
          message: `user not found`,
        })
      );
    }
    return user;
  };
}