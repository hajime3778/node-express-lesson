import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Todo } from "../../model/todo";
import { ITodoRepository } from "./interface";
import { NotFoundDataError, SqlError } from "../../utils/error";

export class TodoRepository implements ITodoRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async findAll(): Promise<Todo[] | Error> {
    try {
      const sql = "select * from todos";
      const [rows] = await this.connection.execute<Todo[] & RowDataPacket[]>(sql);
      if (rows.length === 0) {
        return [];
      }
      return rows;
    } catch (error) {
      return new SqlError(`Todo.findAll() ERROR: ${error}`);
    }
  }

  public async getById(id: number): Promise<Todo | Error> {
    try {
      const sql = "select * from todos where id = ?";
      const [rows] = await this.connection.execute<Todo & RowDataPacket[]>(sql, [id]);
      if (rows.length === 0) {
        return new NotFoundDataError(`対象のデータが見つかりませんでした`);
      }
      return rows;
    } catch (error) {
      return new SqlError(`Todo.getById() ERROR: ${error}`);
    }
  }

  public async create(todo: Todo): Promise<number | Error> {
    throw new Error("Method not implemented.");
  }

  public async update(id: number, todo: Todo): Promise<void | Error> {
    throw new Error("Method not implemented.");
  }

  public async delete(id: number): Promise<void | Error> {
    throw new Error("Method not implemented.");
  }
}
