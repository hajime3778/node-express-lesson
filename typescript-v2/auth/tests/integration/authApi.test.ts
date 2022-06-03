import axios from "axios";
import { compare } from "bcrypt";
import * as dotenv from "dotenv";
import { Connection, RowDataPacket } from "mysql2/promise";
import { User } from "../../src/model/user";
import { verifyAccessToken } from "../../src/utils/token";
import { createDBConnection } from "../utils/Database";
import { createUserHashedPasswordTestData } from "../utils/testData/createUserTestData";

dotenv.config();
const { PORT } = process.env;
axios.defaults.baseURL = `http://localhost:${PORT}`;
axios.defaults.headers.common = { "Content-Type": "application/json" };
axios.defaults.validateStatus = (status) => status >= 200 && status < 500;

let connection: Connection;

beforeEach(async () => {
  connection = await createDBConnection();
  await connection.query(`delete from users`);
});

afterEach(async () => {
  await connection.end();
});

describe("AuthApi", () => {
  describe("signIn", () => {
    it("should return 200 status", async () => {
      const [expectUser] = await createUserHashedPasswordTestData(connection, 1);
      const response = await axios.post<string>("/api/auth/signin", expectUser);
      if (response.status !== 200) {
        throw new Error("Test failed because an error has occurred.");
      }
      const token = response.data;

      const payload = verifyAccessToken(token);
      if (payload instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      expect(response.status).toBe(200);
      expect(payload.userId).toBe(expectUser.id);
      expect(payload.name).toBe(expectUser.name);
      expect(payload.email).toBe(expectUser.email);
    });
    it("should return 401 status", async () => {
      const [expectUser] = await createUserHashedPasswordTestData(connection, 1);
      expectUser.password = "mismatch password";
      const response = await axios.post<string>("/api/auth/signin", expectUser);
      expect(response.status).toBe(401);
    });
    it("should return 404 status", async () => {
      const notExistsUser: User = {
        name: "name",
        email: "email",
        password: "password",
      };
      const response = await axios.post<string>("/api/auth/signin", notExistsUser);
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
      if (response.status !== 200) {
        throw new Error("Test failed because an error has occurred.");
      }
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
