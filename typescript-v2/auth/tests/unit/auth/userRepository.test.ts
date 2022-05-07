import { Connection, RowDataPacket } from "mysql2/promise";
import { User } from "../../../src/model/user";
import { UserRepository } from "../../../src/repository/user/userRepository";
import { NotFoundDataError } from "../../../src/utils/error";
import { createDBConnection } from "../../utils/Database";
import { createUserTestData } from "../../utils/testData/createUserTestData";

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query(`delete from users`);
});

afterEach(async () => {
  await connection.end();
});

describe("UserRepository", () => {
  describe("getById", () => {
    it("shoud return user", async () => {
      const repository = new UserRepository(connection);
      const [expectUser] = await createUserTestData(connection, 1);

      const result = await repository.getById(expectUser.id!);
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      expect(result.id).toBe(expectUser.id);
      expect(result.name).toBe(expectUser.name);
      expect(result.email).toBe(expectUser.email);
      expect(result.password).toBe(expectUser.password);
    });
    it("shoud return notfound error", async () => {
      const repository = new UserRepository(connection);

      const result = await repository.getById(1);
      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }
      expect(result instanceof NotFoundDataError).toBeTruthy();
    });
  });

  describe("getByEmail", () => {
    it("shoud return user", async () => {
      const repository = new UserRepository(connection);
      const [expectUser] = await createUserTestData(connection, 1);

      const result = await repository.getById(expectUser.id!);
      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      expect(result.id).toBe(expectUser.id);
      expect(result.name).toBe(expectUser.name);
      expect(result.email).toBe(expectUser.email);
      expect(result.password).toBe(expectUser.password);
    });

    it("shoud return notfound error", async () => {
      const repository = new UserRepository(connection);
      const result = await repository.getById(1);
      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof NotFoundDataError).toBeTruthy();
    });
  });

  describe("create", () => {
    it("shoud return createdId", async () => {
      const repository = new UserRepository(connection);
      const user: User = {
        name: "name",
        email: "email",
        password: "passsword",
      };
      const createdId = await repository.create(user);
      if (createdId instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${createdId.message}`);
      }

      const query = `select * from users where id = ${createdId}`;
      const [rows] = await connection.query<User & RowDataPacket[]>(query);
      const result = rows[0] as User;

      expect(result.id).toBe(createdId);
      expect(result.name).toBe(user.name);
      expect(result.email).toBe(user.email);
      expect(result.password).toBe(user.password);
    });
  });
});
