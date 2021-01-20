import { Connection } from 'mysql';
import { Todo } from '../model/Todo';

/** Todoのデータベース操作を行う */
export class TodoRepository { 
  connection: Connection;

  /**
   * 初期化
   * @param mysqlConnection {Connection} connection
   */
  constructor(connection: Connection) { 
    this.connection = connection
  }
  
  /**
   * Todoを全件取得します
   * @returns Promise
   */
  public getAll(): Promise<Todo[]> {
    const sql = 'select * from todos';
    return new Promise<Todo[]>((resolve, reject) => {
      this.connection.query(sql, (err, results) => {
        const todos = results.map((todo: Todo) => { 
          return {
            id: todo.id,
            title: todo.title,
            description: todo.description,
          } as Todo
        });
        return err ? reject(err.message) : resolve(todos);
      });
    });
  }

  /**
   * Todoをidで1件取得します
   * @param  {number} id
   * @returns Promise
   */
  public get(id: number): Promise<Todo> { 
    const sql = 'select * from todos where ?';
    return new Promise<Todo>((resolve, reject) => {
      this.connection.query(sql, {id: id}, (err, results) => {
        if (err) return reject(err.message);
        if (results.length !== 1) return reject('no data');
        const todo: Todo = {
          id: results[0].id,
          title: results[0].title,
          description: results[0].description,
        };
        return resolve(todo);
      });
    });
  }

  /**
   * Todoを1件追加します
   * @param  {Todo} todo
   * @returns Promise
   */
  public async create(todo: Todo): Promise<string> { 
    const sql = 'insert into todos set ?';
    return new Promise<string>((resolve, reject) => { 
      this.connection.query(sql, todo, (err, result) => {
        return err ? reject(err.message) : resolve(result.id);
      });
    });
  }

  /**
   * Todoを1件更新します
   * @param  {Todo} todo
   * @returns Promise
   */
  public update(todo: Todo): Promise<string> { 
    const sql = 'update todos set ? where ?';
    return new Promise<string>((resolve, reject) => {
      const id = todo.id;
      delete todo.id;
      this.connection.query(sql, [todo, {id: id}], (err) => {
        return err ? reject(err.message) : resolve('');
      });
    });
  }

  /**
   * Todoを1件削除します
   * @param  {number} id
   * @returns Promise
   */
  public delete(id: number): Promise<string> { 
    const sql = 'delete from todos where ?';
    return new Promise<string>((resolve, reject) => {
      this.connection.query(sql, {id: id}, (err) => {
        return err ? reject(err.message) : resolve('');
      });
    });
  }
}
