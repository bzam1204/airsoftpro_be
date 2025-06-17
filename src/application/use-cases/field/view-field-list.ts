import {inject, injectable} from "tsyringe";

import FieldRepository from "@/domain/repositories/field-repository";
import Field from "@/domain/entities/field";

import {FIELD_REPOSITORY} from "@/shared/constants/constants";

@injectable()
export default class ViewFieldList {

    constructor(@inject(FIELD_REPOSITORY) private readonly fieldRepository: FieldRepository) {
    }

    async execute(): Promise<Field[]> {
        return this.fieldRepository.findAll();
    };

};
