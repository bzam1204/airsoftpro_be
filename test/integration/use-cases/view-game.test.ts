import GameRepository from "@/domain/repositories/game-repository";
import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";
import ViewGame from "@/application/use-cases/game/view-game";

describe("Ver uma Partida", function () {

  it("Deve retornar os dados de uma partida", async function () {
    const gameRepository = new GameRepositoryMemory();
    const viewGame = new ViewGame(gameRepository);
    const game = await viewGame.execute("1");
    expect(game).toBeInstanceOf(Game);
  });

  it("Deve retornar os dados de uma partida", async function () {
    const gameRepository = {findById : (gameId: string) => Promise.resolve(null)} as GameRepository;
    const viewGame = new ViewGame(gameRepository);
    await expect(viewGame.execute('1')).rejects.toThrow('GAME_NOT_FOUND');
  });

})