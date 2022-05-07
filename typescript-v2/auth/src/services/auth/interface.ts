import { User } from "../../model/user";

export interface IAuthService {
  signIn(email: string, password: string): Promise<string | Error>;
  signUp(user: User): Promise<string | Error>;
}
