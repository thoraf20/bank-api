import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const emailPattern =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export const phonePattern = new RegExp("^[0-9-+]{11,}$");

export const passwordPattern = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$"
);

export function APIError({
  code,
  message,
  status,
  data,
}: {
  message: string;
  status: StatusCodes;
  code?: number;
  data?: any[];
}) {
  this.code = code;
  this.message = message;
  this.status = status;
  this.name = "APIError";
  this.data = data;
}

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};