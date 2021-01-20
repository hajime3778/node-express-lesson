import { Router } from 'express'
import { Todo } from '../model/Todo'

class TodoController { 
  router: Router;

  constructor() { 
    this.router = Router();
  }
}
