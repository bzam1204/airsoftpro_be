import User from '@/domain/entities/user';

export default interface UserRepository {

    findByEmail(email: string): Promise<User | null>;

    findById(id: string): Promise<User | null>;

    create(user: User): Promise<User>;

    count(): Promise<number>;

};
