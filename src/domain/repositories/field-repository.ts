export default interface FieldRepository {
  findById(fieldId: string): Promise<Field>;
}