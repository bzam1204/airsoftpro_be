import JoinGame from "@/application/use-cases/join-game";

import GameStatus from "@/domain/enums/game-status";
import GameRules from "@/domain/entities/game-rules";
import Game from "@/domain/entities/game";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";

describe("Entrar na Partida", function () {

  it("Deve inscrever um jogador em uma partida", async function () {
    const [gameId, playerId] = ["1", "1"];
    const joinGame = new JoinGame(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    const game = await joinGame.execute(gameId, playerId);
    expect(game.playerList).toContain(playerId);
  });

  it("Não deve inscrever um jogador já inscrito", async function () {
    const joinGame = new JoinGame(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    await joinGame.execute('1', '1');
    await expect(joinGame.execute('1', '1')).rejects.toThrow('PLAYER_ALREADY_IN_GAME');
  });

  it("Não deve inscrever um jogador em uma partida inexistente", async function () {
    const joinGame = new JoinGame(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    await expect(joinGame.execute('999', '1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))("Não deve inscrever um jogador em uma partida com status diferente de SCHEDULED", async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, status, id : "1"})]);
    const joinGame = new JoinGame(gameRepository, new PlayerRepositoryMemory());
    await expect(joinGame.execute("1", "1")).rejects.toThrow('GAME_NOT_IN_SCHEDULED_STATUS');
  });

  it("Não deve inscrever um jogador em uma partida cheia", async function () {
    const game = new Game({...gameProps, gameRules : new GameRules({playersLimit : 2}), playerList : ["3", "2"]});
    const gameRepository = new GameRepositoryMemory([game]);
    const joinGame = new JoinGame(gameRepository, new PlayerRepositoryMemory());
    await expect(joinGame.execute("1", "1")).rejects.toThrow('GAME_FULL');
  })

  it("Não deve inscrever um jogador inexistente", async function () {
    const joinGame = new JoinGame(new GameRepositoryMemory(), new PlayerRepositoryMemory([]));
    await expect(joinGame.execute("1", "999")).rejects.toThrow('PLAYER_NOT_FOUND');
  });

});
