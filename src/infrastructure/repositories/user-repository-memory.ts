import UserRepository from "@/domain/repositories/user-repository";
import User from "@/domain/entities/user";

export default class UserRepositoryMemory implements UserRepository {
  private readonly users: User[];

  constructor(users?: User[]) {
    this.users = users ?? [];
  };

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(p => p.email);
    return user ? user : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(p => p.id === id);
    return user ? user : null;
  };

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  };

  async count(): Promise<number> {
    return this.users.length;
  };

};
