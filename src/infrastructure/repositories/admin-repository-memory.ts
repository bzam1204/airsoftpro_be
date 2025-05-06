import AdminRepository from "@/domain/repositories/admin-repository";
import Admin from "@/domain/entities/admin";

export default class AdminRepositoryMemory implements AdminRepository {
  private readonly admins: Admin[];

  constructor(admins?: Admin[]) {
    this.admins = this.populate(admins);
  };

  async findById(id: string): Promise<Admin | null> {
    const admin = this.admins.find(p => p.id === id);
    return admin ? admin : null;
  };

  private populate(admins?: Admin[]) {
    if (admins) return admins;
    return new Array(10).fill(null).map((_, i) => new Admin({name : `admin${++i}`, id : `${i}`}));
  };

};
