import { Todo } from "../../src/model/todo";
import { ITodoRepository } from "../../src/repository/todo/interface";
import { TodoService } from "../../src/services/todo/todoService";
import { NotFoundDataError } from "../../src/utils/error";

function createMockRepository(): ITodoRepository {
  const mockRepository: ITodoRepository = {
    findAll: jest.fn(() => {
      throw new Error("Function not implemented.");
    }),
    getById: jest.fn((id: number) => {
      throw new Error("Function not implemented.");
    }),
    create: jest.fn((todo: Todo) => {
      throw new Error("Function not implemented.");
    }),
    update: jest.fn((id: number, todo: Todo) => {
      throw new Error("Function not implemented.");
    }),
    delete: jest.fn((id: number) => {
      throw new Error("Function not implemented.");
    }),
  };

  return mockRepository;
}

function createMockTodoList(num: number): Todo[] {
  const todoList: Todo[] = [];

  for (let index = 0; index < num; index++) {
    const post: Todo = {
      id: index,
      title: `title_${index}`,
      description: `description_${index}`,
    };
    todoList.push(post);
  }

  return todoList;
}

describe("TodoService findAll test", () => {
  it("findAll", async () => {
    const mockResult: Todo[] = createMockTodoList(5);

    let mockRepository = createMockRepository();
    mockRepository.findAll = jest.fn(() => new Promise<Todo[] | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const result = await service.findAll();

    if (result instanceof Error) {
      throw new Error("Test failed because an error has occurred.");
    }

    expect(5).toBe(result.length);

    for (let index = 0; index < result.length; index++) {
      expect(mockResult[index].id).toBe(result[index].id);
      expect(mockResult[index].title).toBe(result[index].title);
      expect(mockResult[index].description).toBe(result[index].description);
    }
  });

  it("abnormality", async () => {
    const errMsg = "mock error";
    const mockResult: Error = new Error(errMsg);

    let mockRepository = createMockRepository();
    mockRepository.findAll = jest.fn(() => new Promise<Todo[] | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const result = await service.findAll();

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }

    expect(result.message).toBe(mockResult.message);
  });
});

describe("TodoService getById test", () => {
  it("getById", async () => {
    const mockResult: Todo = {
      id: 1,
      title: "title",
      description: "description",
    };

    let mockRepository = createMockRepository();
    mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const result = await service.getById(1);

    if (result instanceof Error) {
      throw new Error("Test failed because an error has occurred.");
    }

    expect(result.id).toBe(mockResult.id);
  });

  it("abnormality", async () => {
    const errMsg = "mock error";
    const mockResult: Error = new Error(errMsg);

    let mockRepository = createMockRepository();
    mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const result = await service.getById(1);

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }

    expect(result.message).toBe(mockResult.message);
  });
});

describe("TodoService create test", () => {
  it("create", async () => {
    const mockResult: number = 1;

    let mockRepository = createMockRepository();
    mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const createTodo: Todo = {
      title: "title",
      description: "description",
    };
    const result = await service.create(createTodo);

    if (result instanceof Error) {
      throw new Error("Test failed because an error has occurred.");
    }

    expect(result).toBe(mockResult);
  });

  it("abnormality", async () => {
    const errMsg = "mock error";
    const mockResult: Error = new Error(errMsg);

    let mockRepository = createMockRepository();
    mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const createTodo: Todo = {
      title: "title",
      description: "description",
    };
    const result = await service.create(createTodo);

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }

    expect(result.message).toBe(mockResult.message);
  });
});

describe("TodoService update test", () => {
  it("update", async () => {
    const mockGetByIdResult: Todo = {
      title: "title",
      description: "description",
    };

    let mockRepository = createMockRepository();
    mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
    mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));

    const service = new TodoService(mockRepository);

    const updateTodo: Todo = {
      title: "title",
      description: "description",
    };
    const result = await service.update(1, updateTodo);

    expect(result instanceof Error).toBeFalsy();
  });

  it("target not found", async () => {
    const mockGetByIdResult: Error = new NotFoundDataError("mock notfound error");

    let mockRepository = createMockRepository();
    mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
    mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));

    const service = new TodoService(mockRepository);

    const updateTodo: Todo = {
      id: 1,
      title: "title",
      description: "description",
    };
    const result = await service.update(1, updateTodo);

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }

    expect(result instanceof NotFoundDataError).toBeTruthy();
    expect(result.message).toBe(mockGetByIdResult.message);
  });

  it("abnormality", async () => {
    const mockGetByIdResult: Todo = {
      id: 1,
      title: "title",
      description: "description",
    };
    const errMsg = "mock error";
    const mockUpdateResult: Error = new Error(errMsg);

    let mockRepository = createMockRepository();
    mockRepository.getById = jest.fn(() => new Promise<Todo | Error>((resolve) => resolve(mockGetByIdResult)));
    mockRepository.update = jest.fn(() => new Promise<void | Error>((resolve) => resolve(mockUpdateResult)));

    const service = new TodoService(mockRepository);

    const updateTodo: Todo = {
      id: 1,
      title: "title",
      description: "description",
    };
    const result = await service.update(1, updateTodo);

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }
    expect(result.message).toBe(mockUpdateResult.message);
  });
});

describe("TodoService delete test", () => {
  it("delete", async () => {
    let mockRepository = createMockRepository();
    mockRepository.delete = jest.fn(() => new Promise<void | Error>((resolve) => resolve()));
    const service = new TodoService(mockRepository);

    const result = await service.delete(1);

    expect(result instanceof Error).toBeFalsy;
  });

  it("abnormality", async () => {
    const errMsg = "mock error";
    const mockResult: Error = new Error(errMsg);

    let mockRepository = createMockRepository();
    mockRepository.delete = jest.fn(() => new Promise<void | Error>((resolve) => resolve(mockResult)));
    const service = new TodoService(mockRepository);

    const result = await service.delete(1);

    if (!(result instanceof Error)) {
      throw new Error("Test failed because no error occurred");
    }

    expect(result.message).toBe(mockResult.message);
  });
});
