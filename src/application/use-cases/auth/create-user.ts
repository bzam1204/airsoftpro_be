import UserRepository from "@/domain/repositories/user-repository";
import HashingService from "@/application/services/hashing-service";
import IdGenerator from "@/application/services/id-generator";
import User from "@/domain/entities/user";

export default class CreateUser {
  saltRounds = 10;

  constructor(
      private readonly userRepository: UserRepository,
      private readonly hashingService: HashingService,
      private readonly idGenerator: IdGenerator,
  ) {
  };

  async execute(input: Input): Promise<Output> {
    if (await this.userAlreadyExists(input.email)) throw new Error('USER_ALREADY_EXISTS');
    const id = this.idGenerator.generate();
    const password = await this.hashingService.hash(input.password, this.saltRounds);
    const user = new User({...input, id, password});
    return this.userRepository.create(user);
  };

  private async userAlreadyExists(email: string) {
    return !!await this.userRepository.findByEmail(email)
  };

};

interface Input {
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
}

type Output = User