import {inject, injectable} from "tsyringe";

import EditField from "@/application/use-cases/field/edit-field";

import Http from "@/infrastructure/http";

import {EDIT_FIELD, HTTP} from "@/shared/constants/constants";

@injectable()
export default class FieldController {
  private readonly PREFIX = '/field';

  constructor(
      @inject(EDIT_FIELD) readonly editField: EditField,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('put', `${this.PREFIX}/:id`, async function (params: {id: string}, body: EditFieldInputDto) {
      const id = params.id;
      const field = await editField.execute({id, ...body});
      return {field};
    });

  };

};

interface EditFieldInputDto {
  infrastructure: string;
  description: string;
  coordinates?: string;
  address: string;
  photos: string[];
  rules: string;
  name: string;
}
