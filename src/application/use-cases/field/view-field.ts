import {inject, injectable} from "tsyringe";

import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

import {FIELD_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class ViewField {

  constructor(@inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository) {
  }

  async execute(id: string): Promise<Field> {
    const field = await this.fieldRepository.findById(id);
    if (!field) throw new Error('FIELD_NOT_FOUND');
    return field;
  };

};
