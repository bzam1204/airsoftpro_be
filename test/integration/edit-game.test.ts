import EditGame from "@/application/use-cases/edit-game";

import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";

describe("Editar Partida", function () {

  it('Deve editar as informações de uma partida', async function () {
    const gameRepository = new GameRepositoryMemory([new Game(gameProps)]);
    const editGame = new EditGame(gameRepository);
    const updateGame = new Game({...gameProps, })
    const game = await editGame.execute(updateGame);
    expect(game).toEqual(updateGame);
  });
  
})