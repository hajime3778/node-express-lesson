const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const TodoRepository = require("./repository/TodoRepository");
const TodoService = require("./service/TodoService");
const TodoController = require("./controller/TodoController");

//#region expressでWebサーバーの設定

// expressで4000ポートにサーバー起動
const server = app.listen(4000, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

// expressの設定 (cors method header 許可の設定)
app.disable('x-powered-by');
app.use(cors()).use(bodyParser.json());

// cors を使用せず手動で設定すると以下のような感じになる
// app.use((req, res, next) => {
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

// mysqlに接続
const connection = mysql.createConnection({
  host: 'localhost',
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

// TodoAPI
const todoRepository = new TodoRepository(connection);
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

app.use('/api/', todoController.router);
