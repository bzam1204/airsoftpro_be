import FieldRepository from "@/domain/repositories/field-repository";
import FieldDetails from "@/domain/entities/field-details";
import Field from "@/domain/entities/field";

export default class FieldRepositoryMemory implements FieldRepository {
  async findById(fieldId: string): Promise<Field> {
    return new Field({
      fieldDetails : new FieldDetails({
        infrastructure : '',
        description : '',
        address : '',
        photos : [],
        rules : '',

      }),
      gamesList : [],
      adminId : '1',
      name : 'Clube do Operador',
      id : '1',
    })
  };

};
