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

TodoService.prototype.get = async function() {
  return await this.todoRepository.get();
}

TodoService.prototype.create = async function() {
  return await this.todoRepository.create();
}

TodoService.prototype.update = async function() {
  return await this.todoRepository.update();
}

TodoService.prototype.delete = async function() {
  return await this.todoRepository.delete();
}

module.exports = TodoService;
