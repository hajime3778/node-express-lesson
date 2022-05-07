import { Connection, ResultSetHeader } from "mysql2/promise";
import { User } from "../../../src/model/user";

export async function createUserTestData(connection: Connection, num: number): Promise<User[]> {
  const userList: User[] = [];

  for (let index = 0; index < num; index++) {
    const user: User = {
      name: `name_${index}`,
      email: `email_${index}`,
      password: `password_${index}`,
    };
    const query = `insert into users(name,email,password) values("${user.name}","${user.email}","${user.password}")`;
    const [result] = await connection.query<ResultSetHeader>(query);

    user.id = result.insertId;
    userList.push(user);
  }

  return userList;
}
