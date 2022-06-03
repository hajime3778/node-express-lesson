import { User } from "../../../src/model/user";
import { IUserRepository } from "../../../src/repository/user/interface";
import { AuthService } from "../../../src/services/auth/authService";
import * as jwt from "jsonwebtoken";
import { AccessTokenPayload, verifyAccessToken } from "../../../src/utils/token";
import { hash } from "bcrypt";
import { MismatchEmailOrPassword } from "../../../src/utils/error";

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

describe("AuthService", () => {
  describe("signIn", () => {
    it("should return accesstoken", async () => {
      const password = "password";
      const hashedPassword: string = await hash(password, 10);
      const mockResult: User = {
        id: 1,
        name: "name",
        email: "email",
        password: hashedPassword,
      };

      let mockRepository = createMockRepository();
      mockRepository.getByEmail = jest.fn(() => new Promise<User | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const result = await service.signIn("email", "password");

      if (result instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      const payload = verifyAccessToken(result);
      if (payload instanceof Error) {
        throw new Error("Test failed because an error has occurred.");
      }

      expect(payload.userId).toBe(mockResult.id);
      expect(payload.name).toBe(mockResult.name);
      expect(payload.email).toBe(mockResult.email);
    });

    it("should return missmatch error", async () => {
      const password = "password";
      const hashedPassword: string = await hash(password, 10);
      const mockResult: User = {
        id: 1,
        name: "name",
        email: "email",
        password: hashedPassword,
      };

      let mockRepository = createMockRepository();
      mockRepository.getByEmail = jest.fn(() => new Promise<User | Error>((resolve) => resolve(mockResult)));
      const service = new AuthService(mockRepository);

      const result = await service.signIn("email", "mismatch password");

      if (!(result instanceof Error)) {
        throw new Error("Test failed because no error occurred");
      }

      expect(result instanceof MismatchEmailOrPassword).toBeTruthy();
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
