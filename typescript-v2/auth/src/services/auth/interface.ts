import { User } from "../../model/user";

export interface IAuthService {
  signIn(email: string, password: string): Promise<User | Error>;
  signUp(user: User): Promise<string | Error>;
}
