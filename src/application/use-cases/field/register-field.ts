import FieldRepository from "@/domain/repositories/field-repository";
import AdminRepository from "@/domain/repositories/admin-repository";
import IdGenerator from "@/application/services/id-generator";
import FieldDetails from "@/domain/entities/field-details";
import Field from "@/domain/entities/field";

export default class RegisterField {

  constructor(
      private readonly fieldRepository: FieldRepository,
      private readonly adminRepository: AdminRepository,
      private readonly idGenerator: IdGenerator,
  ) {
  }

  async execute({adminId, name, ..._fieldDetails}: Props) {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) throw new Error('ADMIN_NOT_FOUND');
    const id = this.idGenerator.generate();
    const fieldDetails = new FieldDetails({..._fieldDetails});
    const field = new Field({fieldDetails, adminId, name, id});
    return await this.fieldRepository.create(field);
  };

};

interface Props {
  infrastructure: string,
  description: string,
  coordinates?: string,
  address: string,
  adminId: string,
  photos: string[],
  rules: string,
  name: string
}