import { Request, Response, NextFunction } from "express";
import { TOKEN_HEADER_KEY, verifyAccessToken } from "../../utils/token";

function requireAccessToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[TOKEN_HEADER_KEY];

  if (token == null) {
    res.status(401).json({ message: "token is not specified" });
    return;
  }

  const payload = verifyAccessToken(token);
  if (payload instanceof Error) {
    res.status(401).json({ message: payload.message });
    return;
  }
  res.locals = {
    ...res.locals,
    payload: payload,
  };
  next();
}

export { requireAccessToken };
