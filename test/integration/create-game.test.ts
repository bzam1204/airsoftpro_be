import CreateGame from "@/application/use-cases/create-game";

import Game from "@/domain/entities/game";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";

describe("Criar Partida", function () {
  it("Deve criar uma partida", async function () {
    const idGeneratorStub = {generate : () => '1'};
    const fieldRepository = new FieldRepositoryMemory();
    const gameRepository = new GameRepositoryMemory([]);
    const createGame = new CreateGame(idGeneratorStub, gameRepository, fieldRepository);

    const game = await createGame.execute(gameProps);
    expect(game).toBeInstanceOf(Game);
  });

  it("Não deve criar uma partida com horário anterior a agora", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = {generate : () => '1'};
    const fieldRepository = new FieldRepositoryMemory();
    const createGame = new CreateGame(idGeneratorStub, gameRepository, fieldRepository);
    await expect(createGame.execute({
      ...gameProps,
      startDate : new Date(Date.now() - 1000 + 60),
    })).rejects.toThrow("INVALID_START_DATE");
  });

  it("Não deve criar uma partida com limite de jogadores menor que 2", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = {generate : () => '1'};
    const fieldRepository = new FieldRepositoryMemory();
    const createGame = new CreateGame(idGeneratorStub, gameRepository, fieldRepository);
    await expect(createGame.execute({
      ...gameProps,
      playersLimit : 1,
    })).rejects.toThrow("INVALID_PLAYER_LIMIT");
  });

  it("Não deve criar uma partida com limite de fps menor que 200", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = {generate : () => '1'};
    const fieldRepository = new FieldRepositoryMemory();
    const createGame = new CreateGame(idGeneratorStub, gameRepository, fieldRepository);
    await expect(createGame.execute({
      ...gameProps,
      fpsLimit : 199,
    })).rejects.toThrow("INVALID_FPS_LIMIT");
  });

  it("Não deve criar uma partida com campo inexistente", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = {generate : () => '1'};
    const fieldRepositoryStub = {findById : () => Promise.resolve(null)};
    const createGame = new CreateGame(idGeneratorStub, gameRepository, fieldRepositoryStub);
    await expect(createGame.execute({
      ...gameProps,
      fieldId : 'INVALID_ID',
    })).rejects.toThrow("FIELD_NOT_FOUND");
  });

});
