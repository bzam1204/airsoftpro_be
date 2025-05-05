import ViewGame from "@/application/use-cases/view-game";
import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

describe("Ver uma Partida", function () {
  it("Deve retornar os dados de uma partida", async function () {
    const gameRepository = new GameRepositoryMemory();
    const viewGame = new ViewGame(gameRepository);
    const game = await viewGame.execute("1");
    expect(game).toBeInstanceOf(Game);
  })
})