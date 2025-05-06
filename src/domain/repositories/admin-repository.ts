import Admin from "@/domain/entities/admin";

export default interface AdminRepository {
  findById(id: string): Promise<Admin | null>;
};
