import JoinGame from "@/application/use-cases/join-game";

import Game, {GameStatus} from "@/domain/entities/game";
import GameRules from "@/domain/entities/game-rules";
import Player from "@/domain/entities/player";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

const GAME_DATA = {
  description : undefined,
  startDate : new Date(Date.now() + 1000 * 60 * 60 * 12),
  gameMode : "MilSim",
  fieldId : "123",
  status : GameStatus.SCHEDULED,
  id : "adsfa",
};

const PLAYER_DATA = {
  motto : 'undefined ;)',
  honor : 6,
  name : 'Player 1',
  id : '1',
}

describe("Join Game", function () {

  it("Deve inscrever um jogador em uma partida", async function () {
    const [gameId, playerId] = ["1", "1"];
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await joinGame.execute(gameId, playerId);
    const game = await gameRepository.findById(gameId);
    if (!game) throw new Error("Game not found");
    expect(game.playerList).toContain(playerId);
  });

  it("Não deve inscrever um jogador já inscrito", async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await joinGame.execute('1', '1');
    await expect(joinGame.execute('1', '1')).rejects.toThrow('PLAYER_ALREADY_IN_GAME');
  });

  it("Não deve inscrever um jogador em uma partida inexistente", async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await expect(joinGame.execute('999', '1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))("Não deve inscrever um jogador em uma partida com status diferente de SCHEDULED", async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...GAME_DATA, status, id : "1"})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await expect(joinGame.execute("1", "1")).rejects.toThrow('GAME_NOT_IN_SCHEDULED_STATUS');
  });

  it("Não deve inscrever um jogador em uma partida cheia", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({
      ...GAME_DATA,
      id : "1",
      gameRules : new GameRules({playersLimit : 2}),
      playerList : ["3", "2"]
    })]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await expect(joinGame.execute("1", "1")).rejects.toThrow('GAME_FULL');
  })

  it("Não deve inscrever um jogador inexistente", async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(null)}
    const joinGame = new JoinGame(gameRepository, playerRepositoryStub);
    await expect(joinGame.execute("1", "999")).rejects.toThrow('PLAYER_NOT_FOUND');
  });

});
