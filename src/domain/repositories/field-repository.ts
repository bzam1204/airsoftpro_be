import Field from "@/domain/entities/field";

export default interface FieldRepository {
  findById(fieldId: string): Promise<Field | null>;
}