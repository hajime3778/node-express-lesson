/**
 * Todoのロジック部分を行う
 * 
 * @param  {} todoRepository
 */
const TodoService = function(todoRepository) {
  this.todoRepository = todoRepository;
}

TodoService.prototype.getAll = async function() {
  return await this.todoRepository.getAll();
}

TodoService.prototype.get = async function(id) {
  return await this.todoRepository.get(id);
}

TodoService.prototype.create = async function(todo) {
  return await this.todoRepository.create(todo);
}

TodoService.prototype.update = async function(id, todo) {
  return await this.todoRepository.update(id, todo);
}

TodoService.prototype.delete = async function(id) {
  return await this.todoRepository.delete(id);
}

module.exports = TodoService;
