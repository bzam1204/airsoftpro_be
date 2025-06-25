import request from 'supertest';

import GameStatus from '@/domain/enums/game-status';
import Game from '@/domain/entities/game';

import GameRepositoryMemory from '@/infrastructure/repositories/game-repository-memory';
import GameController from '@/infrastructure/controllers/game-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {GAME_REPOSITORY, HTTP} from '@/shared/constants/constants';

import gameProps from '@test/shared/game-props';

describe('Iniciar Partida por HTTP', function () {
    let app: ExpressAdapter;

    beforeAll(function () {
        app = new ExpressAdapter(container);
        container.register(HTTP, {useValue: app});

        const game = new Game({...gameProps, playerList: ['1', '2']});
        container.register(GAME_REPOSITORY, {useValue: new GameRepositoryMemory([game])});
        app.registerControllers([GameController]);
    });

    it('Deve iniciar uma partida', async function () {
        await request(app.getInstance())
            .post('/game/1/start')
            .send({})
            .expect(200)
            .expect(res => {
                const game = res.body.data.game;
                expect(game).toBeDefined();
                expect(game._status).toBe(GameStatus.STARTED);
            });
    });

});
