import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql';
import { AddressInfo } from 'net';
import bodyParser from 'body-parser';
import cors from 'cors';
import { TodoController } from './controller/TodoController';
import { TodoServiceImpl } from './service/impl/TodoServiceImpl';
import { TodoRepositoryImpl } from './repository/impl/TodoRepositoryImpl';

import { Todo } from './model/Todo';


const app = express();

//#region expressでWebサーバーの設定

// expressで4000ポートにサーバー起動
const server = app.listen(4000, () => {
  const address = server.address() as AddressInfo;
  console.log("Node.js is listening to PORT:" + address.port);
});

// expressの設定 (cors method header 許可の設定)
app.disable('x-powered-by');
app.use(cors()).use(bodyParser.json());

// cors を使用せず手動で設定すると以下のような感じになる
// app.use((req: Request, res: Response, next:NextFunction ) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Authorization, access_token'
//   );

//   if ('OPTIONS' === req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// });

//#endregion

//#region mysqlに接続

const connection = mysql.createConnection({
  host: '',
  port: 3306,
  user: 'user',
  password: 'password',
  database: 'sample_database',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('connected mysql');
});

//#endregion

//#region APIのエンドポイント(APIに接続するためのURL)を設定

const todoRepository = new TodoRepositoryImpl(connection);
const todoService = new TodoServiceImpl(todoRepository);
const todoController = new TodoController(todoService);

app.use('/api/', todoController.router);

// // todoすべてを取得する
// app.get("/api/todos", async (req: Request, res: Response, next: NextFunction) => {
//   const todos = await todoService.getAll();
//   res.json(todos);
// });

// // todo1件を取得する
// app.get("/api/todos/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const id: number = parseInt(req.params.id);
//   const todo = await todoService.get(id);
//   res.json(todo);
// });

// // todo1件を作成する
// app.post("/api/todos", async (req: Request, res: Response, next: NextFunction) => {
//   const todo: Todo = req.body;
//   const id = await todoService.create(todo);
//   res.status(201).json(id);
// });

// // todo1件を更新する
// app.put("/api/todos/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const id: number = parseInt(req.params.id);
//   const todo: Todo = req.body;
//   todo.id = id;
//   await todoService.update(todo);
//   res.status(200).send();
// });

// // todo1件を削除する
// app.delete("/api/todos/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const id: number = parseInt(req.params.id);
//   await todoService.delete(id);
//   res.status(204).send();
// });

//#endregion
