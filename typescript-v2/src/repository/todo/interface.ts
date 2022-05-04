import { Todo } from "../../model/todo";

export interface ITodoRepository {
  findAll(limit: number, offset: number): Promise<Todo[] | Error>;
  getById(id: number): Promise<Todo | Error>;
  create(todo: Todo): Promise<number | Error>;
  update(id: number, todo: Todo): Promise<void | Error>;
  delete(id: number): Promise<void | Error>;
}
