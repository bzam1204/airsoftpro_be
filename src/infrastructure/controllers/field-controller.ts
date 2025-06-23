import {inject, injectable} from 'tsyringe';

import RegisterField from '@/application/use-cases/field/register-field';
import ViewFieldList from '@/application/use-cases/field/view-field-list';
import EditField from '@/application/use-cases/field/edit-field';
import ViewField from '@/application/use-cases/field/view-field';

import Http from '@/infrastructure/http';

import {
    REGISTER_FIELD,
    VIEW_FIELD_LIST,
    EDIT_FIELD,
    VIEW_FIELD,
    HTTP,
} from '@/shared/constants/constants';

@injectable()
export default class FieldController {
    private readonly PREFIX = '/field';

    constructor(
        @inject(REGISTER_FIELD) readonly registerField: RegisterField,
        @inject(VIEW_FIELD_LIST) readonly viewFieldList: ViewFieldList,
        @inject(EDIT_FIELD) readonly editField: EditField,
        @inject(VIEW_FIELD) readonly viewField: ViewField,
        @inject(HTTP) readonly http: Http,
    ) {

        http.on('get', this.PREFIX, async function (params: any, query: any) {
            const fields = await viewFieldList.execute();
            return {fields};
        });

        http.on('get', `${this.PREFIX}/:id`, async function (params: {id: string}, body: any) {
            const fieldId = params.id;
            const field = await viewField.execute(fieldId);
            return {field};
        });

        http.on('post', this.PREFIX, async function (params: any, body: RegisterFieldInputDto) {
            const field = await registerField.execute(body);
            return {field};
        });

        http.on('put', `${this.PREFIX}/:id`, async function (params: {id: string}, body: EditFieldInputDto) {
            const id = params.id;
            const field = await editField.execute({...body, id});
            return {field};
        });

    };

};

interface RegisterFieldInputDto {
    name: string;
    address: string;
    infrastructure: string;
    description: string;
    adminId: string;
    photos: string[];
    rules: string;
    coordinates?: string;
}

interface EditFieldInputDto {
    name: string;
    address: string;
    infrastructure: string;
    description: string;
    photos: string[];
    rules: string;
    coordinates?: string;
}
