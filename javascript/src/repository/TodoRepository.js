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
      return err ? reject(err.message) : resolve(results);
    });
  })
}

TodoRepository.prototype.get = function(id) {
  const sql = 'select * from todos where ?';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, {id: id}, (err, results) => {
      return err ? reject(err.message) : resolve(results[0]);
    });
  })
}

TodoRepository.prototype.create = function(todo) {
  const sql = 'insert into todos set ?';
  return new Promise((resolve, reject) => {
    this.connection.query(sql, todo, (err, result) => {
      return err ? reject(err.message) : resolve(result.id);
    });
  })
}

TodoRepository.prototype.update = function(id, todo) {
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
