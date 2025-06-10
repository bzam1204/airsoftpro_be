import request from 'supertest';

import ExpressAdapter from "@/infrastructure/express-adapter";
import GameController from "@/infrastructure/controllers/game-controller";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";

describe('Ver uma Partida por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter();
        container.register(HTTP, {useValue: app});
        container.resolve(GameController);
    });

    it('Deve retornar os dados de uma partida', async function () {
        await request(app.getInstance())
            .get('/game/1')
            .expect(200)
            .expect(res => {
                expect(res.body.game).toBeDefined();
            });
    });

});
