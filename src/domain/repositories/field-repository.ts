import Field from "@/domain/entities/field";

export default interface FieldRepository {
  findAll(): Promise<Field[]>;

  findById(fieldId: string): Promise<Field | null>;

  create(field: Field): Promise<Field>;
}