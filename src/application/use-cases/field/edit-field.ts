import {inject, injectable} from "tsyringe";

import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

import {FIELD_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class EditField {

  constructor(@inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository) {
  };

  async execute({id, name, ...input}: Input): Promise<Field> {
    const field = await this.fieldRepository.findById(id);
    if (!field) throw new Error('FIELD_NOT_FOUND');
    field.editInfo({...input, name});
    return await this.fieldRepository.update(field);
  };

};

interface Input {
  infrastructure: string;
  description: string;
  coordinates?: string;
  address: string;
  photos: string[];
  rules: string;
  name: string;
  id: string;
}
