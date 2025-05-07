import HashingService from "@/application/services/hashing-service";
import IdGenerator from "@/application/services/id-generator";

import UserRepository from "@/domain/repositories/user-repository";
import User from "@/domain/entities/user";

export default class CreateUser {
  saltRounds = 10;

  constructor(
      private readonly userRepository: UserRepository,
      private readonly hashingService: HashingService,
      private readonly idGenerator: IdGenerator,
  ) {
  };

  async execute(props: Props): Promise<User> {
    if (await this.userAlreadyExists(props.name)) throw new Error('NAME_ALREADY_IN_USE');
    const id = this.idGenerator.generate();
    const password = await this.hashingService.hash(props.password, this.saltRounds);
    const user = new User({...props, id, password});
    return this.userRepository.create(user);
  };

  private async userAlreadyExists(name: string) {
    return !!await this.userRepository.findByName(name)
  };

};

interface Props {
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
  name: string;
}
