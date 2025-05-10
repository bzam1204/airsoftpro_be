import ViewGameList from "@/application/use-cases/view-game-list";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

describe('Ver Lista de Partidas', function () {

  it("Deve listar todas as partidas", async function () {
    const gameRepository = new GameRepositoryMemory();
    const viewGameList = new ViewGameList(gameRepository);
    const gameList = await viewGameList.execute();
    expect(gameList.length).toBe(10);
  });

});
