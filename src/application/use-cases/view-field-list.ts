import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

export default class ViewFieldList {
  
  constructor(private readonly fieldRepository: FieldRepository){
  }
  
  async execute(): Promise<Field[]> {
    return this.fieldRepository.findAll();
  };
  
};