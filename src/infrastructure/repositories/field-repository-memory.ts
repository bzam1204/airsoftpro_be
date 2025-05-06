import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

import fieldProps from "@test/shared/field-props";

export default class FieldRepositoryMemory implements FieldRepository {
  async findById(fieldId: string): Promise<Field> {
    return new Field(fieldProps);
  };

};
