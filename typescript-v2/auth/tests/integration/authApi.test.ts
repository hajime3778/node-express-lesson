import axios from "axios";
import { compare } from "bcrypt";
import * as dotenv from "dotenv";
import { Connection, RowDataPacket } from "mysql2/promise";
import { User } from "../../src/model/user";
import { verifyAccessToken } from "../../src/utils/token";
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
  describe("signup", () => {
    it("should return accesstoken", async () => {
      const request: User = {
        name: "name",
        email: "email",
        password: "password",
      };
      const response = await axios.post<string>("/api/auth/signup", request);
      const token = response.data;

      const payload = verifyAccessToken(token);

      if (payload instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      const query = `select * from users where id = ${payload.userId}`;
      const [rows] = await connection.query<User & RowDataPacket[]>(query);
      const queryResult = rows[0] as User;

      const isMatchPassword = await compare(request.password, queryResult.password);

      expect(response.status).toBe(200);
      expect(queryResult.id).toBe(payload.userId);
      expect(queryResult.name).toBe(payload.name);
      expect(queryResult.email).toBe(payload.email);
      expect(isMatchPassword).toBeTruthy();
    });
  });
});
