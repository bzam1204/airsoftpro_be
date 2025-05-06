import UserRepository from "@/domain/repositories/user-repository";
import IdGenerator from "@/domain/services/id-generator";
import User from "@/domain/entities/user";

export default class CreateUser {

  constructor(
      private readonly userRepository: UserRepository,
      private readonly idGenerator: IdGenerator,
  ) {
  }

  async execute(props: Props): Promise<User> {
    if (await this.userAlreadyExists(props.name)) throw new Error('NAME_ALREADY_IN_USE');
    const id = this.idGenerator.generate();
    const user = new User({...props, id});
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
