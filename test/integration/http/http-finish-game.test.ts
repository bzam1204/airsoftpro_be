import request from 'supertest';

import GameStatus from '@/domain/enums/game-status';
import Game from '@/domain/entities/game';

import GameRepositoryMemory from '@/infrastructure/repositories/game-repository-memory';
import GameController from '@/infrastructure/controllers/game-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {GAME_REPOSITORY, HTTP} from '@/shared/constants/constants';

import gameProps from '@test/shared/game-props';

describe('Finalizar Partida por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});
        container.register(GAME_REPOSITORY, {
            useValue: new GameRepositoryMemory([new Game({...gameProps, status: GameStatus.STARTED})])
        });
        app.registerControllers([GameController]);
    });

    it('Deve finalizar uma partida', async function () {
        await request(app.getInstance())
            .post('/game/1/finish')
            .send({})
            .expect(200)
            .expect(res => {
                expect(res.body.game).toBeDefined();
            });
    });

});
