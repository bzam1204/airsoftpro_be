import CancelGame from "@/application/use-cases/cancel-game";

import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";
import GameStatus from "@/domain/enums/game-status";

describe('Cancelar Partida', function () {

  it('Deve cancelar uma partida', async function () {
    const gameRepository = new GameRepositoryMemory();
    const cancelGame = new CancelGame(gameRepository);
    const game = await cancelGame.execute('1');
    expect(game.status).toBe(GameStatus.CANCELLED);
  });

  it('Não deve cancelar uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const cancelGame = new CancelGame(gameRepository);
    await expect(cancelGame.execute('1')).rejects.toThrow("GAME_NOT_FOUND");
  });

  it('Não deve cancelar uma partida cancelada', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.CANCELLED})]);
    const cancelGame = new CancelGame(gameRepository);
    await expect(cancelGame.execute('1')).rejects.toThrow("INVALID_STATUS_TO_CANCEL");
  });

  it('Não deve cancelar uma partida concluída', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.FINISHED})]);
    const cancelGame = new CancelGame(gameRepository);
    await expect(cancelGame.execute('1')).rejects.toThrow("INVALID_STATUS_TO_CANCEL");
  });

});
