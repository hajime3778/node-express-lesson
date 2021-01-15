const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

// expressで4000ポートにサーバー起動
const server = app.listen(4000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

// expressの設定 (cors method header 許可の設定)
app.disable('x-powered-by');
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  );
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

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
  console.log('connected');
});

// todoすべてを取得する
app.get("/api/todos", (req, res, next) => {
  const sql = 'select * from todos';
  connection.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// todo1件を取得する
app.get("/api/todos/:id", (req, res, next) => {
  const id = req.params.id;
  const sql = 'select * from todos where ?';
  connection.query(sql, {id: id}, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// todo1件を作成する
app.post("/api/todos", (req, res, next) => {
  const todo = req.body;
  const sql = 'insert into todos set ?';
  connection.query(sql, todo, (err, result) => {
    if (err) throw err;
    res.status(201).json(result.id);
  });
});

// todo1件を更新する
app.put("/api/todos/:id", (req, res, next) => {
  const id = req.params.id;
  const todo = req.body;
  const sql = 'update todos set ? where ?';
  connection.query(sql, [todo, {id: id}], (err, result) => {
    if (err) throw err;
    res.status(200).send();
  });
});

// todo1件を削除する
app.delete("/api/todos/:id", (req, res, next) => {
  const id = req.params.id;
  const sql = 'delete from todos where ?';
  connection.query(sql, {id: id}, (err, results) => {
    if (err) throw err;
    res.status(204).send();
  });
});
