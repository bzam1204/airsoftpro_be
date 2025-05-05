import FinishGame from "@/application/use-cases/finish-game";

import Game, {GameStatus} from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import gameProps from "@test/shared/game-data";

describe("Finalizar Partida", function () {

  it("Deve finalizar uma partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status : GameStatus.IN_PROGRESS})]);
    const endGame = new FinishGame(gameRepository);
    const game = await endGame.execute('1');
    expect(game.status).toBe(GameStatus.COMPLETED);
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.IN_PROGRESS))('Não deve finalizar uma partida que não esteja em andamento', async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status})]);
    const finishGame = new FinishGame(gameRepository);
    await expect(finishGame.execute('1')).rejects.toThrow('GAME_NOT_IN_PROGRESS')
  });

});