import { User } from "../../model/user";
import { IUserRepository } from "../../repository/user/interface";
import { IAuthService } from "./interface";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async signIn(email: string, password: string): Promise<User | Error> {
    const user = await this.userRepository.getByEmail(email);
    return user;
  }

  public async signUp(user: User): Promise<number | Error> {
    const result = await this.userRepository.create(user);
    return result;
  }
}
