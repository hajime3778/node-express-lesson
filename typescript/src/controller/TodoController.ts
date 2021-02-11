import { Request, Response, Router } from 'express';

import { TodoService } from '../service/TodoService';
import { Todo } from '../model/Todo'

/** TodoAPIのエンドポイント(APIに接続するためのURL)の設定を行う */
export class TodoController {
  private todoService: TodoService;
  public router: Router;

  /**
   * 初期化
   * @param  {TodoService} todoService
   */
  constructor(todoService: TodoService) {
    this.todoService = todoService;
    this.router = Router();

    // todoすべてを取得する
    this.router.get('/todos', async (req: Request, res: Response) => { 
      const todos = await this.todoService.getAll().catch((err: string) => { 
        res.status(500).send(err);
        return;
      });
      res.status(200).send(todos);
    });

    // todo1件を取得する
    this.router.get('/todos/:id', async (req: Request, res: Response) => { 
      const id: number = parseInt(req.params.id);
      const todo = await this.todoService.get(id).catch((err: string) => { 
        res.status(500).send(err);
        return;
      });
      res.status(200).send(todo);
    });

    // todo1件を作成する
    this.router.post('/todos', async (req: Request, res: Response) => { 
      const todo: Todo = req.body;
      const result = await this.todoService.create(todo).catch((err: string) => { 
        res.status(500).send(err);
        return;
      });
      console.log(result);
      res.status(201).json(result);
    });

    // todo1件を更新する
    this.router.put('/todos/:id', async (req: Request, res: Response) => { 
      const todo: Todo = { id: parseInt(req.params.id), title: req.body.title, description: req.body.description };
      await this.todoService.update(todo).catch((err: string) => { 
        res.status(500).send(err);
        return;
      });
      res.status(200).send();
    });

    // todo1件を削除する
    this.router.delete('/todos/:id', async (req: Request, res: Response) => { 
      const id: number = parseInt(req.params.id);
      await this.todoService.delete(id).catch((err: string) => { 
        res.status(500).send(err);
        return;
      });
      res.status(204).send();
    });
  }
}
