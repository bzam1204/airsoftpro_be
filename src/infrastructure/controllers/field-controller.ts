import {inject, injectable} from "tsyringe";

import RegisterField from "@/application/use-cases/field/register-field";
import EditField from "@/application/use-cases/field/edit-field";
import CreateFieldAdmin from "@/application/use-cases/field/create-field-admin";
import ViewFieldList from "@/application/use-cases/field/view-field-list";
import ViewField from "@/application/use-cases/field/view-field";

import Http from "@/infrastructure/http";

import {
  CREATE_FIELD_ADMIN,
  EDIT_FIELD,
  HTTP,
  REGISTER_FIELD,
  VIEW_FIELD,
  VIEW_FIELD_LIST
} from "@/shared/constants/constants";

@injectable()
export default class FieldController {
  private readonly fieldsPrefix = '/fields';
  private readonly fieldAdminsPrefix = '/field-admins';

  constructor(
      @inject(REGISTER_FIELD) readonly registerField: RegisterField,
      @inject(EDIT_FIELD) readonly editField: EditField,
      @inject(CREATE_FIELD_ADMIN) readonly createFieldAdmin: CreateFieldAdmin,
      @inject(VIEW_FIELD_LIST) readonly viewFieldList: ViewFieldList,
      @inject(VIEW_FIELD) readonly viewField: ViewField,
      @inject(HTTP) readonly http: Http,
  ) {

    http.on('post', this.fieldAdminsPrefix, async function (params: any, body: CreateFieldAdminDto) {
      const fieldAdmin = await createFieldAdmin.execute(body);
      return {fieldAdmin};
    });

    http.on('put', `${this.fieldsPrefix}/:fieldId`, async function (params: {fieldId: string}, body: EditFieldDto) {
      const fieldId = params.fieldId;
      const field = await editField.execute({id: fieldId, ...body});
      return {field};
    });

    http.on('post', this.fieldsPrefix, async function (params: any, body: RegisterFieldDto) {
      const field = await registerField.execute(body);
      return {field};
    });

    http.on('get', this.fieldsPrefix, async function () {
      const fields = await viewFieldList.execute();
      return fields;
    });

    http.on('get', `${this.fieldsPrefix}/:fieldId`, async function (params: {fieldId: string}) {
      const fieldId = params.fieldId;
      const field = await viewField.execute(fieldId);
      return {field};
    });

  };

};

interface CreateFieldAdminDto {
  userId: string;
}

interface EditFieldDto {
  infrastructure?: string;
  coordinates?: string;
  description?: string;
  address?: string;
  photos?: string[];
  rules?: string;
  name?: string;
}

interface RegisterFieldDto {
  infrastructure: string;
  description: string;
  address: string;
  adminId: string;
  photos: string[];
  rules: string;
  name: string;
}
