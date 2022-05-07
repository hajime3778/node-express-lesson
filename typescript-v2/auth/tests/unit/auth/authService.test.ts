import { User } from "../../../src/model/user";
import { IUserRepository } from "../../../src/repository/user/interface";
import { AuthService } from "../../../src/services/auth/authService";
import * as jwt from "jsonwebtoken";
import { AccessTokenPayload, verifyAccessToken } from "../../../src/utils/token";

function createMockRepository(): IUserRepository {
  const mockRepository: IUserRepository = {
    getById: jest.fn((id: number) => {
      throw new Error("Function not implemented.");
    }),
    getByEmail: jest.fn((email: string) => {
      throw new Error("Function not implemented.");
    }),
    create: jest.fn((user: User) => {
      throw new Error("Function not implemented.");
    }),
  };

  return mockRepository;
}

describe("UserService", () => {
  describe("signIn", () => {
    it("should return user", async () => {
      const mockResult: User = {
        id: 1,
        name: "name",
        email: "email",
        password: "password",
      };

      let mockRepository = createMockRepository();
      mockRepository.getByEmail = jest.fn(() => new Promise<User | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const result = await service.signIn("email", "password");

      if (result instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      expect(result.id).toBe(mockResult.id);
      expect(result.name).toBe(mockResult.name);
      expect(result.email).toBe(mockResult.email);
      expect(result.password).toBe(mockResult.password);
    });

    it("should return repository error", async () => {
      const errMsg = "mock error";
      const mockResult: Error = new Error(errMsg);

      let mockRepository = createMockRepository();
      mockRepository.getByEmail = jest.fn(() => new Promise<User | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const result = await service.signIn("email", "password");

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result.message).toBe(mockResult.message);
    });
  });

  describe("signUp", () => {
    it("should return accesstoken", async () => {
      const mockResult: number = 1;

      let mockRepository = createMockRepository();
      mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const createUser: User = {
        id: 1,
        name: "name",
        email: "email",
        password: "password",
      };
      const result = await service.signUp(createUser);

      if (result instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      const payload = verifyAccessToken(result);
      if (payload instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      expect(payload.userId).toBe(createUser.id);
      expect(payload.name).toBe(createUser.name);
      expect(payload.email).toBe(createUser.email);
    });

    it("should return repository error", async () => {
      const errMsg = "mock error";
      const mockResult: Error = new Error(errMsg);

      let mockRepository = createMockRepository();
      mockRepository.create = jest.fn(() => new Promise<number | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const createUser: User = {
        id: 1,
        name: "name",
        email: "email",
        password: "password",
      };
      const result = await service.signUp(createUser);

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result.message).toBe(mockResult.message);
    });
  });
});
