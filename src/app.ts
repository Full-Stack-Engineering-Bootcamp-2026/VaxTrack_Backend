import express, { Application as ExpressApp, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";

import { AppDataSource } from "./db/db";
import { success, failure } from "./Http_Response/response";

dotenv.config();

class Application {
  public app: ExpressApp;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS || "http://localhost:5173"
    ).split(",");

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS not allowed: ${origin}`));
          }
        },
        credentials: true,
      }),
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.get("/", (_req: Request, res: Response) => {
      return res.json(success(null, "Server is running"));
    });
  }

  private async connectDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("MySQL connected");
    } catch (error) {
      console.error("Database connection failed", error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.connectDatabase();

      this.app.listen(this.port, () => {
        console.log(`Server running at http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Startup failed", error);
    }
  }
}

const application = new Application();
application.start();

export default application.app;
