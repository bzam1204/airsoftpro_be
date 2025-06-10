import request from 'supertest';

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import FieldController from "@/infrastructure/controllers/field-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import Field from "@/domain/entities/field";

import {HTTP, FIELD_REPOSITORY} from "@/shared/constants/constants";

import fieldProps from "@test/shared/field-props";

describe('Ver Lista de Campos por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        const testContainer = container.createChildContainer();
        app = new ExpressAdapter();
        testContainer.register(HTTP, {useValue: app});
        testContainer.register(FIELD_REPOSITORY, {
            useValue: new FieldRepositoryMemory([
                new Field({...fieldProps, id: '1'}),
                new Field({...fieldProps, id: '2'}),
                new Field({...fieldProps, id: '3'})
            ])
        });
        testContainer.resolve(FieldController);
    });

    it('Deve listar todos os campos', async function () {
        await request(app.getInstance())
            .get('/field')
            .expect(200)
            .expect(res => {
                expect(res.body.fields).toBeDefined();
                expect(res.body.fields.length).toBe(3);
            });
    });

    it('Deve retornar lista vazia quando não houver campos', async function () {
        const _container = container.createChildContainer()
        const _app = new ExpressAdapter();
        _container.register(HTTP, {useValue: _app});
        _container.register(FIELD_REPOSITORY, {
            useValue: new FieldRepositoryMemory([])
        });
        _container.resolve(FieldController);

        await request(_app.getInstance())
            .get('/field')
            .expect(200)
            .expect(res => {
                expect(res.body.fields).toBeDefined();
                expect(res.body.fields.length).toBe(0);
            });
    });

});
