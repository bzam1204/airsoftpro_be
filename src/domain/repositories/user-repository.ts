import User from "@/domain/entities/user";

export default interface UserRepository {
  findByName(name: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user:User): Promise<User>;  
};
