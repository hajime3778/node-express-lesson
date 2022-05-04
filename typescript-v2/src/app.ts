import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Todo } from "./model/todo";
import { TodoRepository } from "./repository/todo/todoRepository";
import { NotFoundDataError, SqlError } from "./utils/error";
import { TodoService } from "./services/todo/todoService";

async function main() {
  // envファイル読み込み
  dotenv.config();
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB, PORT } = process.env;

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };

  // CORS設定
  app.use(cors(corsOptions));

  // expressで4000ポートにサーバー起動
  const server = app.listen(parseInt(PORT as string), () => {
    const address = server.address() as AddressInfo;
    console.log("Node.js is listening to PORT:" + address.port);
  });

  const connection = await mysql.createConnection({
    host: MYSQL_HOST as string,
    port: parseInt(MYSQL_PORT as string),
    user: MYSQL_USER as string,
    password: MYSQL_PASS as string,
    database: MYSQL_DB as string,
  });

  const todoRepository = new TodoRepository(connection);
  const todoService = new TodoService(todoRepository);

  app.get("/api/todos", async (req: express.Request, res: express.Response) => {
    const result = await todoService.findAll();
    if (result instanceof Error) {
      res.status(500).json(result.message);
      return;
    }

    res.status(200).json(result);
  });

  app.get("/api/todos/:id", async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const result = await todoService.getById(id);

    if (result instanceof NotFoundDataError) {
      res.status(404).json(result.message);
      return;
    }

    if (result instanceof Error) {
      res.status(500).json(result.message);
      return;
    }

    res.status(200).json(result);
  });

  app.post("/api/todos", async (req: express.Request, res: express.Response) => {
    const todo: Todo = req.body;
    const result = await todoService.create(todo);

    if (result instanceof Error) {
      res.status(500).json(result.message);
      return;
    }

    res.status(201).json(result);
  });

  app.put("/api/todos/:id", async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const todo: Todo = req.body;
    const result = await todoService.update(id, todo);

    if (result instanceof NotFoundDataError) {
      res.status(404).json(result.message);
      return;
    }

    if (result instanceof Error) {
      res.status(500).json(result.message);
      return;
    }

    res.status(200).json(result);
  });

  app.delete("/api/todos/:id", async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const result = await todoService.delete(id);

    if (result instanceof Error) {
      res.status(500).json(result.message);
      return;
    }

    res.status(204).json(result);
  });
}

main();
