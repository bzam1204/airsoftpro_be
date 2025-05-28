import GameStatus from "@/domain/enums/game-status";
import Game from "@/domain/entities/game";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";
import CancelParticipation from "@/application/use-cases/game/cancel-participation";

describe("Cancelar Participação", function () {

  it("Deve remover um jogador de uma partida agendada", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, id : '1', playerList : ['1']})]);
    const cancelParticipation = new CancelParticipation(gameRepository, new PlayerRepositoryMemory());
    const game = await cancelParticipation.execute('1', '1');
    expect(game.playerList).toEqual([]);
  });

  it("Não deve remover um jogador que não esteja na partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, id : '1', playerList : []})]);
    const cancelParticipation = new CancelParticipation(gameRepository, new PlayerRepositoryMemory());
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("PLAYER_NOT_IN_GAME")
  });

  it("Não deve remover um jogador de uma partida não existente", async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const cancelParticipation = new CancelParticipation(gameRepository, new PlayerRepositoryMemory());
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("GAME_NOT_FOUND")
  });

  it("Não deve remover um jogador inexistente de um partida", async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = new PlayerRepositoryMemory([]);
    const cancelParticipation = new CancelParticipation(gameRepository, playerRepositoryStub);
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("PLAYER_NOT_FOUND");
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))("Não deve remover um jogador em uma partida com status diferente de SCHEDULED", async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, id : '1', status, playerList : ['1']})]);
    const cancelParticipation = new CancelParticipation(gameRepository, new PlayerRepositoryMemory());
    await expect(cancelParticipation.execute("1", "1")).rejects.toThrow('GAME_NOT_IN_SCHEDULED_STATUS');
  });

});
