import { NextFunction, Response } from "express";
import { User } from "../entity/user.entity";
import { myDataSource } from "../config/db.config";

export default class UserService {
  static getCurrentUser = async (res: Response): Promise<User | null> => {
    const user = await myDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", {
        id: res.locals.user.id,
      })
      .addSelect("user.password")
      .getOne();

    return user;
  };

  static getUserByEmail = async (email: string): Promise<User | null> => {
    const user = await myDataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", {
        email,
      })
      .addSelect("user.password")
      .getOne();
    return user;
  };

  static getUserByPhone = async (phone: string): Promise<User | null> => {
    return User.findOne({ where: { phoneNumber: phone } });
  };

  static getUserById = async (id: string): Promise<User | null> => {
    return User.findOne({ where: { id } });
  };
}