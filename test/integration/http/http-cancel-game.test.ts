import request from 'supertest';

import GameStatus from "@/domain/enums/game-status";

import GameController from "@/infrastructure/controllers/game-controller";
import ExpressAdapter from "@/infrastructure/express-adapter";
import container from "@/infrastructure/container";

import {HTTP} from "@/shared/constants/constants";

describe('Cancelar Jogo por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        app.registerControllers([GameController]);
    });

    it('Deve  cancelar um jogo', async function () {
        const participationData = {gameId: '1'};
        await request(app.getInstance())
            .delete('/game/1')
            .send(participationData)
            .expect(200)
            .expect(res => {
                //TODO: mapear dtos de saida para evitar usar atributos privados
                expect(res.body.game._status).toBe(GameStatus.CANCELLED);
            });
    });

});
