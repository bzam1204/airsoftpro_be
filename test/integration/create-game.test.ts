import GameRules from "@/domain/entities/game-rules";
import Game from "@/domain/entities/game";
import CreateGame from "@/application/use-cases/create-game";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

describe("Create Game", function () {
  it("Deve criar uma partida", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = { generate: () => '1'};
    const createGame = new CreateGame(idGeneratorStub, gameRepository);
    const game = await createGame.execute({
      specificRules : '',
      minHonorLevel : 0,
      friendlyFire : true,
      playersLimit : 10,
      description : '',
      startDate : new Date(Date.now() + 1000 + 60),
      fpsLimit : 400,
      gameMode : 'MilSim',
      fieldId : '1',
    });
    expect(game).toBeInstanceOf(Game);
  });

  it("Não deve criar uma partida com horário anterior a agora", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = { generate: () => '1'};
    const createGame = new CreateGame(idGeneratorStub, gameRepository);
    await expect(createGame.execute({
      specificRules : '',
      minHonorLevel : 0,
      friendlyFire : true,
      playersLimit : 10,
      description : '',
      startDate : new Date(Date.now() - 1000 + 60),
      fpsLimit : 400,
      gameMode : 'MilSim',
      fieldId : '1',
    })).rejects.toThrow("INVALID_START_DATE");
  });

  it("Não deve criar uma partida com limite de jogadores menor que 2", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = { generate: () => '1'};
    const createGame = new CreateGame(idGeneratorStub, gameRepository);
    await expect(createGame.execute({
      specificRules : '',
      minHonorLevel : 0,
      friendlyFire : true,
      playersLimit : 1,
      description : '',
      startDate : new Date(Date.now() + 1000 + 60),
      fpsLimit : 400,
      gameMode : 'MilSim',
      fieldId : '1',
    })).rejects.toThrow("INVALID_PLAYER_LIMIT");
  });

  it("Não deve criar uma partida com limite de fps menor que 200", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = { generate: () => '1'};
    const createGame = new CreateGame(idGeneratorStub, gameRepository);
    await expect(createGame.execute({
      specificRules : '',
      minHonorLevel : 0,
      friendlyFire : true,
      playersLimit : 10,
      description : '',
      startDate : new Date(Date.now() + 1000 + 60),
      fpsLimit : 199,
      gameMode : 'MilSim',
      fieldId : '1',
    })).rejects.toThrow("INVALID_FPS_LIMIT");
  });

  it("Não deve criar uma partida com campo inexistente", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const idGeneratorStub = { generate: () => '1'};
    const createGame = new CreateGame(idGeneratorStub, gameRepository);
    await expect(createGame.execute({
      specificRules : '',
      minHonorLevel : 0,
      friendlyFire : true,
      playersLimit : 10,
      description : '',
      startDate : new Date(Date.now() + 1000 + 60),
      fpsLimit : 400,
      gameMode : 'MilSim',
      fieldId : 'INVALID_ID',
    })).rejects.toThrow("FIELD_NOT_FOUND");
  });

})