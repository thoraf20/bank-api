import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [],
  migrations: [],
  synchronize: true,
  logging: ["error"],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
