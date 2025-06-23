export default interface HashingService {
    hash(target: string, saltRounds: number): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
};