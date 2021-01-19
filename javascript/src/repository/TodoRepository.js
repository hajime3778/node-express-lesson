const Todo = require('../model/Todo');
/**
 * Todoのデータベース操作を行う
 * @param  {} connection
 */
const TodoRepository = function(connection) {
  this.connection = connection;
}

TodoRepository.prototype.getAll = function() {
  const sql = 'select * from todos';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, (err, results) => {
      if (err) return reject(err.message);
      const todos = results.map((todo) => new Todo(todo.id, todo.title, todo.description));
      return resolve(todos);
    });
  })
}

TodoRepository.prototype.get = function(id) {
  const sql = 'select * from todos where ?';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, {id: id}, (err, results) => {
      if (err) return reject(err.message);
      if (results.length !== 1) return reject('not data');
      const todo = results[0];
      return resolve(new Todo(todo.id, todo.title, todo.description));
    });
  })
}

TodoRepository.prototype.create = function(todo) {
  delete todo.id;
  const sql = 'insert into todos set ?';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, todo, (err, result) => {
      return err ? reject(err.message) : resolve(result.id);
    });
  })
}

TodoRepository.prototype.update = function(todo) {
  const id = todo.id;
  const sql = 'update todos set ? where ?';
  delete todo.id;
  return new Promise((resolve, reject) => {
    this.connection.query(sql, [todo, {id: id}], (err, result) => {
      return err ? reject(err.message) : resolve(result);
    });
  })
}

TodoRepository.prototype.delete = function(id) {
  const sql = 'delete from todos where ?';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, {id: id}, (err, result) => {
      return err ? reject(err.message) : resolve(result);
    });
  })
}

module.exports = TodoRepository;
