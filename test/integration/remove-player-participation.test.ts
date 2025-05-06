import RemovePlayerParticipation from "@/application/use-cases/remove-player-participation";

import Game from "@/domain/entities/game";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";

describe("Remover Participação", function () {

  it('Deve remover a participação de uma partida', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, playerList : ['1']})]);
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, new PlayerRepositoryMemory());
    const game = await removePlayerParticipation.execute('1', '1');
    expect(game.playerList.length).toBe(0);
  });

  it('Não deve remover uma participação em uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, new PlayerRepositoryMemory());
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it('Não deve remover a participação de um jogador inexistente', async function () {
    const playerRepository = new PlayerRepositoryMemory([]);
    const removePlayerParticipation = new RemovePlayerParticipation(new GameRepositoryMemory(), playerRepository);
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('PLAYER_NOT_FOUND');
  });

  it('Não deve remover a participação de um jogador ausente na partida', async function () {
    const removePlayerParticipation = new RemovePlayerParticipation(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('PLAYER_NOT_IN_GAME');
  });

});
