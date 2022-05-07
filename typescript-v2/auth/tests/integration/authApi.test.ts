import axios from "axios";
import * as dotenv from "dotenv";
import { Connection, RowDataPacket } from "mysql2/promise";
import { User } from "../../src/model/user";
import { createDBConnection } from "../utils/Database";
import { createUserTestData } from "../utils/testData/createUserTestData";

dotenv.config();
const { PORT } = process.env;
axios.defaults.baseURL = `http://localhost:${PORT}`;
axios.defaults.headers.common = { "Content-Type": "application/json" };
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  connection.query(`delete from users`);
});

afterEach(async () => {
  await connection.end();
});

describe("AuthApi", () => {
  describe("signIn", () => {
    it("should return 200 status", async () => {
      const [expectUser] = await createUserTestData(connection, 1);
      const response = await axios.post<User>("/api/auth/signin", expectUser);

      expect(response.status).toBe(200);
      expect(response.data.id).toBe(expectUser.id);
      expect(response.data.name).toBe(expectUser.name);
      expect(response.data.email).toBe(expectUser.email);
      expect(response.data.password).toBe(expectUser.password);
    });
    it("should return 404 status", async () => {
      const notExistsUser: User = {
        name: "name",
        email: "email",
        password: "password",
      };
      const response = await axios.post<User>("/api/auth/signin", notExistsUser);
      expect(response.status).toBe(404);
    });
  });
  describe("create", () => {
    it("should return 201 status", async () => {
      const request: User = {
        name: "name",
        email: "email",
        password: "password",
      };
      const response = await axios.post<number>("/api/auth/signup", request);
      const createdId = response.data;

      const query = `select * from users where id = ${createdId}`;
      const [rows] = await connection.query<User & RowDataPacket[]>(query);
      const queryResult = rows[0] as User;

      expect(response.status).toBe(201);
      expect(queryResult.id).toBe(createdId);
      expect(queryResult.name).toBe(request.name);
      expect(queryResult.email).toBe(request.email);
      expect(queryResult.password).toBe(request.password);
    });
  });
});
