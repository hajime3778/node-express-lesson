import { AccessTokenPayload, generateAccessToken, verifyAccessToken } from "../../../src/utils/token";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError, JsonWebTokenError } from "../../../src/utils/error";

let secretKey: string;

beforeAll(() => {
  dotenv.config();
  const { SECRET_KEY } = process.env;
  secretKey = SECRET_KEY as string;
});

describe("TestToken", () => {
  describe("generateAccessToken", () => {
    it("should return token", async () => {
      const payload: AccessTokenPayload = {
        userId: 1,
        name: "name",
        email: "email",
      };

      const token = generateAccessToken(payload);
      const decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as AccessTokenPayload & jwt.JwtPayload;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.name).toBe(payload.name);
      expect(decoded.email).toBe(payload.email);
      const unixtime = Math.floor(new Date().getTime() / 1000);
      expect(decoded.exp).toBe(unixtime + 86400);
    });
    it("should return setting expired token", async () => {
      const payload: AccessTokenPayload = {
        userId: 1,
        name: "name",
        email: "email",
      };

      const token = generateAccessToken(payload, 60 * 60 * 48);
      const decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as AccessTokenPayload & jwt.JwtPayload;

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.name).toBe(payload.name);
      expect(decoded.email).toBe(payload.email);
      const unixtime = Math.floor(new Date().getTime() / 1000);
      expect(decoded.exp).toBe(unixtime + 172800);
    });
  });

  describe("verifyAccessToken", () => {
    it("should return success", async () => {
      const payload: AccessTokenPayload = {
        userId: 1,
        name: "name",
        email: "email",
      };
      const token = jwt.sign(payload, secretKey, { algorithm: "HS256", expiresIn: 60 });
      const result = verifyAccessToken(token);

      if (result instanceof Error) {
        throw new Error(`Test failed because an error has occurred: ${result.message}`);
      }

      expect(payload.userId).toBe(result.userId);
      expect(payload.name).toBe(result.name);
      expect(payload.email).toBe(result.email);
    });
    it("should return error expired token", async () => {
      const payload: AccessTokenPayload = {
        userId: 1,
        name: "name",
        email: "email",
      };
      const token = jwt.sign(payload, secretKey, { algorithm: "HS256", expiresIn: -1 });
      const result = verifyAccessToken(token);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof TokenExpiredError).toBeTruthy();
    });
    it("should return error incorrect token", async () => {
      const token = "invalid token";
      const result = verifyAccessToken(token);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof JsonWebTokenError).toBeTruthy();
    });
  });
});
