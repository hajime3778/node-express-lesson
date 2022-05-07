import { compare, hash } from "bcrypt";
import { User } from "../../model/user";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { AccessTokenPayload, generateAccessToken } from "../../utils/token";
import { IUserRepository } from "../../repository/user/interface";
import { IAuthService } from "./interface";
import { MismatchEmailOrPassword } from "../../utils/error";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async signIn(email: string, password: string): Promise<string | Error> {
    const result = await this.userRepository.getByEmail(email);
    if (result instanceof Error) {
      return result;
    }

    const user: User = result;
    const isMatchPassword = await compare(password, user.password);

    if (!isMatchPassword) {
      return new MismatchEmailOrPassword("mismatch email or password");
    }

    const payload: AccessTokenPayload = {
      userId: user.id as number,
      name: user.name,
      email: user.email,
    };

    return generateAccessToken(payload);
  }

  public async signUp(user: User): Promise<string | Error> {
    const hashedPassword: string = await hash(user.password, 10);
    user.password = hashedPassword;

    const result = await this.userRepository.create(user);
    if (result instanceof Error) {
      return result;
    }
    const createdId: number = result;

    const payload: AccessTokenPayload = {
      userId: createdId,
      name: user.name,
      email: user.email,
    };

    return generateAccessToken(payload);
  }
}
