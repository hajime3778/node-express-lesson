import { userInfo } from 'os';
import { Todo } from '../../model/Todo'
import { TodoRepository } from '../../repository/TodoRepository'

export class TodoServiceImpl { 
  private todoRepository: TodoRepository;

  /**
   * 初期化
   * @param mysqlConnection {Connection} connection
   */
  constructor(todoRepository: TodoRepository) { 
    this.todoRepository = todoRepository;
  }
  
  /**
   * Todoを全件取得します
   * @returns Promise
   */
  public async getAll(): Promise<Todo[]> {
    return this.todoRepository.getAll();
  }

  /**
   * Todoをidで1件取得します
   * @param  {number} id
   * @returns Promise
   */
  public async get(id: number): Promise<Todo> { 
    return this.todoRepository.get(id);
  }

  /**
   * Todoを1件追加します
   * @param  {Todo} todo
   * @returns Promise
   */
  public async create(todo: Todo): Promise<string> {
    return this.todoRepository.create(todo);
  }

  /**
   * Todoを1件更新します
   * @param  {Todo} todo
   * @returns Promise
   */
  public async update(todo: Todo): Promise<string> {
    return this.todoRepository.update(todo);
  }

  /**
   * Todoを1件削除します
   * @param  {number} id
   * @returns Promise
   */
  public async delete(id: number): Promise<string> {
    return this.todoRepository.delete(id);
  }
}