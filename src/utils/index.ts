import { StatusCodes } from "http-status-codes";

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
  code: number;
  message: string;
  status: StatusCodes;
  data?: any[];
}) {
  this.code = code;
  this.message = message;
  this.status = status;
  this.name = "APIError";
  this.data = data;
}