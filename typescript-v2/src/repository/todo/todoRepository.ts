import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../model/todo";
import { ITodoRepository } from "./interface";

export class TodoRepository implements ITodoRepository {
  findAll(limit: number, offset: number): Promise<Todo[] | Error> {
    throw new Error("Method not implemented.");
  }
  getById(id: number): Promise<Todo | Error> {
    throw new Error("Method not implemented.");
  }
  create(todo: Todo): Promise<number | Error> {
    throw new Error("Method not implemented.");
  }
  update(id: number, todo: Todo): Promise<void | Error> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void | Error> {
    throw new Error("Method not implemented.");
  }
}
