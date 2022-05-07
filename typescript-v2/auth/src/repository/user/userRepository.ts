import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { User } from "../../model/user";
import { IUserRepository } from "./interface";
import { NotFoundDataError, SqlError } from "../../utils/error";

export class UserRepository implements IUserRepository {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  public async getById(id: number): Promise<User | Error> {
    try {
      const sql = "select * from users where id = ?";
      const [rows] = await this.connection.execute<User & RowDataPacket[]>(sql, [id]);
      if (rows.length === 0) {
        return new NotFoundDataError(`not exists target User`);
      }
      return rows[0] as User;
    } catch (error) {
      return new SqlError(`UserRepository.getById() ERROR: ${error}`);
    }
  }

  public async getByEmail(email: string): Promise<User | Error> {
    try {
      const sql = "select * from users where email = ?";
      const [rows] = await this.connection.execute<User & RowDataPacket[]>(sql, [email]);
      if (rows.length === 0) {
        return new NotFoundDataError(`not exists target User`);
      }
      return rows[0] as User;
    } catch (error) {
      return new SqlError(`UserRepository.getByEmail() ERROR: ${error}`);
    }
  }

  public async create(User: User): Promise<number | Error> {
    try {
      const sql = `
        insert into users(name,email,password) values(?,?,?)
      `;
      const [result] = await this.connection.query<ResultSetHeader>(sql, [User.name, User.email, User.password]);
      return result.insertId;
    } catch (error) {
      return new SqlError(`UserRepository.create() ERROR: ${error}`);
    }
  }
}
