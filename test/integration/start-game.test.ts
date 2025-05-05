import StartGame from "@/application/use-cases/start-game";

import Game, {GameStatus} from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-data";

describe('Iniciar Partida', function () {

  it('Deve iniciar uma partida', async function () {
    const prevGame = new Game(gameProps);
    prevGame.addPlayerParticipation('1');
    prevGame.addPlayerParticipation('2');
    const gameRepository = new GameRepositoryMemory([prevGame]);
    const startGame = new StartGame(gameRepository);
    const game = await startGame.execute('1');
    expect(game.status).toBe(GameStatus.IN_PROGRESS);
  });

  it('Não deve iniciar uma partida sem jogadores suficientes', async function () {
    const gameRepository = new GameRepositoryMemory();
    const startGame = new StartGame(gameRepository);
    await expect(startGame.execute('1')).rejects.toThrow("INSUFFICIENT_PLAYERS");
  });

  it('Não deve iniciar uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const startGame = new StartGame(gameRepository);
    await expect(startGame.execute('1')).rejects.toThrow("GAME_NOT_FOUND");
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))('Não deve iniciar uma partida com status diferente de SCHEDULED', async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status})]);
    const startGame = new StartGame(gameRepository);
    await expect(startGame.execute('1')).rejects.toThrow("GAME_NOT_IN_SCHEDULED_STATUS");
  });

})