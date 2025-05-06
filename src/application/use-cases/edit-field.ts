import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

export default class EditField {

  constructor(private readonly fieldRepository: FieldRepository) {
  };

  async execute({id, name, ...input}: Props): Promise<Field> {
    const field = await this.fieldRepository.findById(id);
    if (!field) throw new Error('FIELD_NOT_FOUND');
    field.editInfo({...input, name});
    return field;
  };

};

interface Props {
  infrastructure: string;
  description: string;
  coordinates?: string;
  address: string;
  photos: string[];
  rules: string;
  name: string;
  id: string;
}