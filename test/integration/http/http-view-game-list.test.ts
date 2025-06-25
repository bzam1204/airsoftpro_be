import request from 'supertest';

import Game from '@/domain/entities/game';

import GameRepositoryMemory from '@/infrastructure/repositories/game-repository-memory';
import GameController from '@/infrastructure/controllers/game-controller';
import ExpressAdapter from '@/infrastructure/express-adapter';
import container from '@/infrastructure/container';

import {GAME_REPOSITORY, HTTP} from '@/shared/constants/constants';

import gameProps from '@test/shared/game-props';

describe('Ver Lista de Partidas por HTTP', function () {

    it('Deve listar todas as partidas', async function () {
        const testContainer = container.createChildContainer();
        const app = new ExpressAdapter(testContainer);
        testContainer.register(HTTP, {useValue: app});
        testContainer.register(GAME_REPOSITORY, {
            useValue: new GameRepositoryMemory([
                new Game({...gameProps, id: '1'}),
                new Game({...gameProps, id: '2'}),
                new Game({...gameProps, id: '3'})
            ])
        });
        app.registerControllers([GameController]);
        await request(app.getInstance())
            .get('/game')
            .expect(200)
            .expect(res => {
                const games = res.body.data.games;
                expect(games).toBeDefined();
                expect(games.length).toBe(3);
            });
    });

    it('Deve retornar lista vazia quando não houver partidas', async function () {
        const _container = container.createChildContainer();
        const _app = new ExpressAdapter(_container);
        _container.register(GAME_REPOSITORY, {
            useValue: new GameRepositoryMemory([])
        });
        _container.register(HTTP, {useValue: _app});
        _app.registerControllers([GameController]);
        await request(_app.getInstance())
            .get('/game')
            .expect(200)
            .expect(res => {
                const games = res.body.data.games;
                expect(games).toBeDefined();
                expect(games.length).toBe(0);
            });
    });

});
