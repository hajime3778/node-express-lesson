import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Todo } from "./model/todo";
import { TodoRepository } from "./repository/todo/todoRepository";
import { NotFoundDataError, SqlError } from "./utils/error";

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

  const repository = new TodoRepository(connection);

  app.get("/api/todos", async (req: express.Request, res: express.Response) => {
    const sql = "select * from todos";
    const [rows] = await connection.execute<Todo[] & RowDataPacket[]>(sql);
    res.json(rows);
  });

  app.get("/api/todos/:id", async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const result = await repository.getById(id);

    if (result instanceof Error) {
      res.json(result.message);
      return;
    }

    res.json(result);
  });
}

main();
