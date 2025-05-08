import FieldAdminRepository from "@/domain/repositories/field-admin-repository";
import FieldAdmin from "@/domain/entities/field-admin";

export default class FieldAdminRepositoryMemory implements FieldAdminRepository {
  private _admins: FieldAdmin[];

  constructor(admins?: FieldAdmin[]) {
    this._admins = admins ?? [];
  };

  async findByUserId(userId: string) {
    const fieldAdmin = this._admins.find(p => p.userId === userId);
    return fieldAdmin? fieldAdmin : null;
  };
  
  async create(fieldAdmin: FieldAdmin): Promise<FieldAdmin> {
    this._admins.push(fieldAdmin);
    return fieldAdmin;
  };

};
