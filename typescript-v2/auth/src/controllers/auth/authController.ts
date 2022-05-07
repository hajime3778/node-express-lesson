import { IAuthService } from "../../services/auth/interface";
import { Request, Response, Router } from "express";
import { MismatchEmailOrPassword, NotFoundDataError } from "../../utils/error";
import { User } from "../../model/user";

export class AuthController {
  private authService: IAuthService;
  public router: Router;

  constructor(authService: IAuthService) {
    this.authService = authService;
    this.router = Router();

    this.router.post("/auth/signin", async (req: Request, res: Response) => {
      const user: User = req.body;
      const result = await this.authService.signIn(user.email, user.password);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof MismatchEmailOrPassword) {
        res.status(401).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });

    this.router.post("/auth/signup", async (req: Request, res: Response) => {
      const user: User = req.body;
      const result = await this.authService.signUp(user);

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });
  }
}
