import bcrypt from 'bcryptjs';

import HashingService from "@/application/services/hashing-service";

export default class HashingServiceBcryptjs implements HashingService {
  bcrypt = bcrypt;

  async hash(target: string, saltRounds: number): Promise<string> {
    return await this.bcrypt.hash(target, saltRounds);
  };

  async compare(password: string, hash: string): Promise<boolean> {
      return await this.bcrypt.compare(password, hash);
  };
  
};
