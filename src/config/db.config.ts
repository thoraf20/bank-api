import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entity/user.entity";

dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [User],
  migrations: [],
  synchronize: true,
  logging: ["error"],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
