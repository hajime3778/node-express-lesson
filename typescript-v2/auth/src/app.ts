import express, { Express } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";
import { createConnection } from "mysql2/promise";
import { TodoRepository } from "./repository/todo/todoRepository";
import { TodoService } from "./services/todo/todoService";
import { TodoController } from "./controllers/todo/todoController";
import { AuthController } from "./controllers/auth/authController";
import { UserRepository } from "./repository/user/userRepository";
import { AuthService } from "./services/auth/authService";

async function main() {
  dotenv.config();
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB, PORT } = process.env;

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: "http://localhost",
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  const server = app.listen(parseInt(PORT as string), () => {
    const address = server.address() as AddressInfo;
    console.log("Node.js is listening to PORT:" + address.port);
  });

  const connection = await createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  // Todo API
  const todoRepository = new TodoRepository(connection);
  const todoService = new TodoService(todoRepository);
  const todoController = new TodoController(todoService);
  app.use("/api/", todoController.router);

  // auth API
  const userRepository = new UserRepository(connection);
  const authService = new AuthService(userRepository);
  const authController = new AuthController(authService);
  app.use("/api/", authController.router);
}

main();
