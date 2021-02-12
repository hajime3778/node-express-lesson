import express, { Application } from 'express';
import { Todo } from '../src/model/Todo';
import { TodoService } from '../src/service/TodoService';
import { TodoController } from '../src/controller/TodoController';
  
import request from 'supertest';
import bodyParser from 'body-parser';

const mockTodoList: Todo[] = [
  {
    id: 1,
    title: 'test1',
    description: 'test1',
  },
  {
    id: 2,
    title: 'test2',
    description: 'test2',
  },
];

const mockTodo: Todo = {
  id: 1,
  title: 'test1',
  description: 'test1',
};

function createMockTodoService(): TodoService { 
  const mockService: TodoService = {
    getAll: jest.fn(() => new Promise<Todo[]>((resolve) => resolve(mockTodoList))),
    get: jest.fn((id: number) => new Promise<Todo>((resolve) => {
      if (id === 1) resolve(mockTodo);
    })),
    create: jest.fn((todo: Todo) => new Promise<string>((resolve) => resolve(todo.id?.toString() as string))),
    update: jest.fn((todo: Todo) => new Promise<string>((resolve) => resolve(todo.id?.toString() as string))),
    delete: jest.fn((id: number) => new Promise<string>((resolve) => resolve(id.toString())))
  };
 return mockService;
}

function createMockErrorTodoService(): TodoService { 
  const mockService: TodoService = {
    getAll: jest.fn(() => new Promise<Todo[]>((resolve, reject) => reject(''))),
    get: jest.fn(() => new Promise<Todo>((resolve, reject) => reject(''))),
    create: jest.fn(() => new Promise<string>((resolve, reject) => reject(''))),
    update: jest.fn(() => new Promise<string>((resolve, reject) => reject(''))),
    delete: jest.fn(() => new Promise<string>((resolve, reject) => reject('')))
  };
 return mockService;
}

describe('TodoRepository 正常系テスト', () => {
  it('getAll', () => {
    const app: Application = express();
    const mockService = createMockTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).get('/api/todos')
            .expect(200);
  });
  it('get', () => {
    const app: Application = express();
    const mockService = createMockTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).get('/api/todos/1')
            .expect(200);
  });
  it('create', () => {
    const app: Application = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    const mockService = createMockTodoService();
    const controller = new TodoController(mockService);
    const todo: Todo = {
      id: 1,
      title: 'test1',
      description: 'test1',
    };
    app.use('/api/', controller.router);
    return request(app).post('/api/todos').send(todo).set('Accept', 'application/json')
            .expect(201);
  });
  it('update', () => {
    const app: Application = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    const mockService = createMockTodoService();
    const controller = new TodoController(mockService);
    const todo: Todo = {
      title: 'test1',
      description: 'test1',
    };
    app.use('/api/', controller.router);
    return request(app).put('/api/todos/1').send(todo).set('Accept', 'application/json').expect(200);
  });
  it('delete', () => {
    const app: Application = express();
    const mockService = createMockTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).delete('/api/todos/1').expect(204);
    });
});

describe('TodoRepository 異常系テスト', () => {
  it('getAll', () => {
    const app: Application = express();
    const mockService = createMockErrorTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).get('/api/todos').expect(500);
  });
  it('get', () => {
    const app: Application = express();
    const mockService = createMockErrorTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).get('/api/todos/2').expect(500);
  });
  it('create', () => {
    const app: Application = express();
    const mockService = createMockErrorTodoService();
    const controller = new TodoController(mockService);
    const todo: Todo = {
      id: 2,
      title: 'test2',
      description: 'test2',
    };
    app.use('/api/', controller.router);
    return request(app).post('/api/todos').send(todo).set('Accept', 'application/json').expect(500);
  });
  it('update', () => {
    const app: Application = express();
    const mockService = createMockErrorTodoService();
    const controller = new TodoController(mockService);
    const todo: Todo = {
      title: 'test2',
      description: 'test2',
    };
    app.use('/api/', controller.router);
    return request(app).put('/api/todos/2').send(todo).set('Accept', 'application/json').expect(500);
  });
  it('delete', () => {
    const app: Application = express();
    const mockService = createMockErrorTodoService();
    const controller = new TodoController(mockService);
    app.use('/api/', controller.router);
    return request(app).delete('/api/todos/2').expect(500);
  });
});

