import FieldAdminRepository from "@/domain/repositories/field-admin-repository";
import UserRepository from "@/domain/repositories/user-repository";
import IdGenerator from "@/application/services/id-generator";
import FieldAdmin from "@/domain/entities/field-admin";

export default class CreateFieldAdmin {

  constructor(
      private readonly fieldAdminRepository: FieldAdminRepository,
      private readonly userRepository: UserRepository,
      private readonly idGenerator: IdGenerator,
  ) {
  }

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) throw new Error('USER_NOT_FOUND');
    const prevFieldAdmin = await this.fieldAdminRepository.findByUserId(input.userId);
    if (prevFieldAdmin) throw new Error('FIELD_ADMIN_ALREADY_EXISTS');
    const id = this.idGenerator.generate();
    const fieldAdmin = await this.fieldAdminRepository.create(new FieldAdmin({...input, id}));
    return {fieldAdmin};
  };

};

interface Input {
  userId: string;
}

interface Output {
  fieldAdmin: FieldAdmin;
}