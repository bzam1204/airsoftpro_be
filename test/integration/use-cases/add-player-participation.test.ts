import GameRules from "@/domain/entities/game-rules";
import Game from "@/domain/entities/game";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

import gameProps from "@test/shared/game-props";
import AddPlayerParticipation from "@/application/use-cases/game/add-player-participation";

describe('Adicionar Participação', function () {

  it('Deve adicionar a participação de um jogador em uma partida', async function () {
    const addPlayerParticipation = new AddPlayerParticipation(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    const game = await addPlayerParticipation.execute('1', '1');
    expect(game.playerList).toContain('1');
  });

  it('Não deve adicionar a participação de um jogador em uma partida inexistente', async function () {
    const addPlayerParticipation = new AddPlayerParticipation(new GameRepositoryMemory([]), new PlayerRepositoryMemory());
    await expect(addPlayerParticipation.execute('1', '1')).rejects.toThrow('GAME_NOT_FOUND');
  });

  it('Não deve adicionar a participação de um jogador inexistente em uma partida', async function () {
    const addPlayerParticipation = new AddPlayerParticipation(new GameRepositoryMemory(), new PlayerRepositoryMemory([]));
    await expect(addPlayerParticipation.execute('1', '1')).rejects.toThrow('PLAYER_NOT_FOUND');
  });

  it('Não deve adicionar a participação de um jogador presente na partida', async function () {
    const addPlayerParticipation = new AddPlayerParticipation(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    await addPlayerParticipation.execute('1', '1');
    await expect(addPlayerParticipation.execute('1', '1')).rejects.toThrow('PARTICIPATION_IN_ANOTHER_GAME');
  });

  it('Não deve adicionar uma participação além do limite', async function () {
    const game = new Game({...gameProps, gameRules : new GameRules({playersLimit : 2}), playerList : ['2', '3']});
    const gameRepository = new GameRepositoryMemory([game]);
    const addPlayerParticipation = new AddPlayerParticipation(gameRepository, new PlayerRepositoryMemory());
    await expect(addPlayerParticipation.execute('1', '1')).rejects.toThrow('GAME_FULL');
  });
  
  it("Não deve adicionar a participação de um jogador em mais de uma partida com mesmo horário de início", async function () {
    const addPlayerParticipation = new AddPlayerParticipation(new GameRepositoryMemory(), new PlayerRepositoryMemory());
    await addPlayerParticipation.execute('2', '1');
    await expect(addPlayerParticipation.execute('1', '1')).rejects.toThrow('PARTICIPATION_IN_ANOTHER_GAME');
  });

});