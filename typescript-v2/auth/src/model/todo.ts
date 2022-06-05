export type Todo = {
  id?: number;
  userId: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};
