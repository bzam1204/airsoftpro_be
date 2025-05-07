import FinishGame from "@/application/use-cases/finish-game";

import GameStatus from "@/domain/enums/game-status";
import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import sleep from "@/shared/utils/sleep";

import gameProps from "@test/shared/game-props";

describe("Finalizar Partida", function () {

  it("Deve finalizar uma partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.STARTED})]);
    const endGame = new FinishGame(gameRepository);
    const game = await endGame.execute('1');
    expect(game.status).toBe(GameStatus.FINISHED);
  });

  it('Não deve finalizar uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const finishGame = new FinishGame(gameRepository);
    await expect(finishGame.execute('1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.STARTED))('Não deve finalizar uma partida que não esteja em andamento', async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status})]);
    const finishGame = new FinishGame(gameRepository);
    await expect(finishGame.execute('1')).rejects.toThrow('GAME_NOT_IN_PROGRESS');
  });

  it("Deve guardar a data ao finalizar uma partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.STARTED})]);
    await sleep(1000);
    const endGame = new FinishGame(gameRepository);
    const game = await endGame.execute('1');
    expect(game.finishDate).toBeDefined();
    expect(game.finishDate!.getMilliseconds()).toBeGreaterThan(game.startDate.getMilliseconds());
  });

});
