import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import logger from "./src/lib/logger";
import { requestLogger } from "./src/middlewares/requestLogger";
import { myDataSource } from "./src/config/db.config";

dotenv.config();

// Middleware to log unhandled exceptions
process.on('uncaughtException', (ex) => {
  console.error(`Uncaught exception: ${ex.message}`, ex);
  process.exit(1); // Exit the process (optional)
});

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error({ message: err.message, code: err.name, name: err.stack });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return res.status(err.status).json({ message: err.message, code: err.code });
});

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
}

// establish database connection
myDataSource.initialize().catch((err) => {
  logger.error('Database connection error: ', err)
})

app.listen(port, () => {
  console.info(`Server is up and running at port: ${port}.`);
});

export default app;