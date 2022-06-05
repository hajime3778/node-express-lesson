import { Connection, ResultSetHeader } from "mysql2/promise";
import { Todo } from "../../../src/model/todo";

export async function createTodoTestData(connection: Connection, userId: number, num: number): Promise<Todo[]> {
  const todoList: Todo[] = [];

  for (let index = 0; index < num; index++) {
    const todo: Todo = {
      userId: userId,
      title: `title_${index}`,
      description: `description_${index}`,
    };
    const query = `insert into todos(user_id, title,description) values("${todo.userId}", "${todo.title}","${todo.description}")`;
    const [result] = await connection.query<ResultSetHeader>(query);

    todo.id = result.insertId;
    todoList.push(todo);
  }

  return todoList;
}
