import request from 'supertest';

import Field from "@/domain/entities/field";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import FieldController from "@/infrastructure/controllers/field-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP, FIELD_REPOSITORY} from "@/shared/constants/constants";

import fieldProps from "@test/shared/field-props";

describe('Visualizar Campo por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        container.register(FIELD_REPOSITORY, {
            useValue: new FieldRepositoryMemory([
                new Field({...fieldProps, id: '1'})
            ])
        });
        container.resolve(FieldController);
    });

    it('Deve visualizar um campo específico', async function () {
        await request(app.getInstance())
            .get('/field/1')
            .expect(200)
            .expect(res => {
                expect(res.body.field).toBeDefined();
            });
    });

});
