import RemovePlayerParticipation from "@/application/use-cases/remove-player-participation";

import Player from "@/domain/entities/player";
import Game from "@/domain/entities/game";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import playerData from "@test/shared/player-data";
import gameProps from "@test/shared/game-data";

describe("Remover Participação", function () {

  it('Deve remover a participação de uma partida', async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...gameProps, playerList : ['1']})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(playerData))};
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, playerRepositoryStub);
    const game = await removePlayerParticipation.execute('1', '1');
    expect(game.playerList.length).toBe(0);
  });

  it('Não deve remover uma participação em uma partida inexistente', async function () {
    const gameRepository = new GameRepositoryMemory([]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(playerData))};
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, playerRepositoryStub);
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it('Não deve remover a participação de um jogador inexistente', async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(null)};
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, playerRepositoryStub);
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('PLAYER_NOT_FOUND');
  });

  it('Não deve remover a participação de um jogador ausente na partida', async function () {
    const gameRepository = new GameRepositoryMemory();
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(playerData))};
    const removePlayerParticipation = new RemovePlayerParticipation(gameRepository, playerRepositoryStub);
    await expect(removePlayerParticipation.execute('1', '1')).rejects.toThrow('PLAYER_NOT_IN_GAME');
  });

});
