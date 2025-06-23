import request from 'supertest';

import Report from "@/domain/entities/report";

import ReportRepositoryMemory from "@/infrastructure/repositories/report-repository-memory";
import ReportController from "@/infrastructure/controllers/report-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP, REPORT_REPOSITORY} from "@/shared/constants/constants";

import reportProps from "@test/unit/report-props";

describe('Ver Histórico de Denúncias Realizadas por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        const testContainer = container.createChildContainer();
        testContainer.register(HTTP, {useValue: app});
        const reportsList = new Array(10).fill(null).map((_, i) => new Report({
            ...reportProps, id: `${++i}`, gameId: `${i}`, from: '2'
        }));
        testContainer.register(REPORT_REPOSITORY, {
            useValue: new ReportRepositoryMemory(reportsList)
        });
        testContainer.resolve(ReportController);
    });

    it('Deve visualizar todas as denúncias realizadas por um jogador', async function () {
        await request(app.getInstance())
            .get('/report/given/2')
            .expect(200)
            .expect(res => {
                expect(res.body.reports.length).toBe(10);
            });
    });

    it('Deve retornar lista vazia quando o jogador não tiver denúncias', async function () {
        const _container = container.createChildContainer();
        _container.register(REPORT_REPOSITORY, {
            useValue: new ReportRepositoryMemory([])
        });
        const _app = new ExpressAdapter(_container);
        _container.register(HTTP, {useValue: _app});
        _container.resolve(ReportController);

        await request(_app.getInstance())
            .get('/report/given/2')
            .expect(200)
            .expect(res => {
                expect(res.body.reports.length).toBe(0);
            });
    });

});
