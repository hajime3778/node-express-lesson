import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { TokenExpiredError, JsonWebTokenError } from "./error";

dotenv.config();
const { SECRET_KEY } = process.env;

export type AccessTokenPayload = {
  userId: number;
  name: string;
  email: string;
};

export function generateAccessToken(payload: AccessTokenPayload, expiresIn: number = 60 * 60 * 24): string {
  const secretKey = SECRET_KEY as string;
  const token = jwt.sign(payload, secretKey, { algorithm: "HS256", expiresIn: expiresIn });
  return token;
}

export function verifyAccessToken(token: string): AccessTokenPayload | Error {
  const secretKey = SECRET_KEY as string;
  let decoded: AccessTokenPayload;
  try {
    decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as AccessTokenPayload;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return new TokenExpiredError("token expired");
    } else if (e instanceof jwt.JsonWebTokenError) {
      return new JsonWebTokenError("incorrect token");
    } else {
      return new Error("other errors occurred during token validation");
    }
  }

  return decoded;
}
