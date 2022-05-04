import { ITodoService } from "../../services/todo/interface";
import { Request, Response, Router } from "express";
import { NotFoundDataError } from "../../utils/error";
import { Todo } from "../../model/todo";

export class TodoController {
  private todoService: ITodoService;
  public router: Router;

  constructor(todoService: ITodoService) {
    this.todoService = todoService;
    this.router = Router();

    this.router.get("/todos", async (req: Request, res: Response) => {
      const result = await todoService.findAll();
      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }
      res.status(200).json(result);
    });

    this.router.get("/todos/:id", async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const result = await todoService.getById(id);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });

    this.router.post("/todos", async (req: Request, res: Response) => {
      const todo: Todo = req.body;
      const result = await todoService.create(todo);

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(201).json(result);
    });

    this.router.put("/todos/:id", async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const todo: Todo = req.body;
      const result = await todoService.update(id, todo);

      if (result instanceof NotFoundDataError) {
        res.status(404).json(result.message);
        return;
      }

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(200).json(result);
    });

    this.router.delete("/todos/:id", async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const result = await todoService.delete(id);

      if (result instanceof Error) {
        res.status(500).json(result.message);
        return;
      }

      res.status(204).json(result);
    });
  }
}
