import express, { Express, Request, Response, NextFunction } from "express";
import { AddressInfo } from "net";
import * as dotenv from "dotenv";

// envファイル読み込み
dotenv.config();
export const { PORT } = process.env;

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// expressで4000ポートにサーバー起動
const server = app.listen(parseInt(PORT as string), () => {
  const address = server.address() as AddressInfo;
  console.log("Node.js is listening to PORT:" + address.port);
});

app.get("/", (req: express.Request, res: express.Response) => {
  let foo = "";
  foo = `{"message": "hello-world"}`;
  res.json(foo);
});
