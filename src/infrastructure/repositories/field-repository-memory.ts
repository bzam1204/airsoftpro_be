import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

import fieldProps from "@test/shared/field-props";

export default class FieldRepositoryMemory implements FieldRepository {
  private readonly fields: Field[];

  constructor(fields?: Field[]) {
    this.fields = this.populate(fields);
  }

  async findAll(): Promise<Field[]> {
    return this.fields;
  };

  async findById(id: string): Promise<Field | null> {
    const field = this.fields.find(p => p.id === id);
    return field ? field : null;
  };

  async create(field: Field): Promise<Field> {
    this.fields.push(field)
    return field;
  };

  async update(field: Field): Promise<Field> {
    const index = this.fields.findIndex(p => p.id === field.id);
    if (index === -1) throw new Error("FIELD_NOT_FOUND");
    this.fields[index] = field;
    return field;
  };

  private populate(fields?: Field[]) {
    if (fields) return fields;
    return new Array(10).fill(null).map((_, i) => new Field({...fieldProps, id : `${++i}`}))
  };

};
