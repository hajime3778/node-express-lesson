const { Router } = require('express');
const Todo = require('../model/Todo');

/**
 * TodoAPIのエンドポイント(APIに接続するためのURL)の設定を行う
 * @param  {} todoService
 */
const TodoController = function(todoService) {
  this.todoService = todoService;
  this.router = Router();

  // todoすべてを取得する
  this.router.get('/todos', async (req, res) => {
    const results = await this.todoService.getAll().catch((err) => {
      console.log(err);
      res.status(500).send(err);
      return;
    });
    res.status(200).json(results);
  });

  // todo1件を取得する
  this.router.get('/todos/:id', async (req, res) => {
    const results = await this.todoService.get(req.params.id).catch((err) => {
      console.log(err);
      res.status(500).send(err);
      return;
    });
    res.status(200).json(results);
  });

  // todo1件を作成する
  this.router.post('/todos', async (req, res) => {
    const todo = new Todo(0, req.body.title, req.body.description);
    const results = await this.todoService.create(todo).catch((err) => {
      console.log(err);
      res.status(400).send(err);
      return;
    });
    res.status(201).json(results);
  });

  // todo1件を更新する
  this.router.put('/todos/:id', async (req, res) => {
    const todo = new Todo(parseInt(req.params.id), req.body.title, req.body.description);
    await this.todoService.update(todo).catch((err) => {
      console.log(err);
      res.status(400).send(err);
      return;
    });
    res.status(200).send();
  });

  // todo1件を削除する
  this.router.delete('/todos/:id', async (req, res) => {
    await this.todoService.delete(req.params.id).catch((err) => {
      console.log(err);
      res.status(500).send(err);
      return;
    });
    res.status(204).send();
  });
}

module.exports = TodoController;
