import { Todo } from "../src/model/Todo";
import { TodoServiceImpl } from "../src/service/impl/TodoServiceImpl";
import { TodoRepository } from "../src/repository/TodoRepository";

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

function createMockTodoRepository(): TodoRepository { 
  const mockRepository: TodoRepository = {
    getAll: jest.fn(() => new Promise<Todo[]>((resolve) => resolve(mockTodoList))),
    get: jest.fn((id: number) => new Promise<Todo>((resolve) => {
      if (id === 1) resolve(mockTodo);
    })),
    create: jest.fn((todo: Todo) => new Promise<string>((resolve) => resolve(todo.id?.toString() as string))),
    update: jest.fn((todo: Todo) => new Promise<string>((resolve) => resolve(todo.id?.toString() as string))),
    delete: jest.fn((id: number) => new Promise<string>((resolve) => resolve(id.toString())))
  };
 return mockRepository;
}

describe('TodoServiceImpl 正常系テスト', () => {
  it('getAll', async () => {
    const mockRepository = createMockTodoRepository();
    const service = new TodoServiceImpl(mockRepository);
    const todoList = await service.getAll();
    expect(todoList).toEqual(mockTodoList);
  });
  it('get', async () => {
    const mockRepository = createMockTodoRepository();
    const service = new TodoServiceImpl(mockRepository);
    const todo = await service.get(1);
    expect(todo).toEqual(mockTodo);
  });
  it('create', async () => {
    const mockRepository = createMockTodoRepository();
    const service = new TodoServiceImpl(mockRepository);
    const todo: Todo = {
      title: 'test1',
      description: 'test1',
    };
    const createdId = await service.create(todo);
    expect(createdId).not.toBeNull();
  });
  it('update', async () => {
    const mockRepository = createMockTodoRepository();
    const service = new TodoServiceImpl(mockRepository);
    const todo: Todo = {
      id: 1,
      title: 'test1',
      description: 'test1',
    };
    const results = await service.update(todo);
    expect(results).toEqual('1');
  });
  it('delete', async () => {
    const mockRepository = createMockTodoRepository();
    const service = new TodoServiceImpl(mockRepository);
    const results = await service.delete(1);
    expect(results).toEqual('1');
  });
});
