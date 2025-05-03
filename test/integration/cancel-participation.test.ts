import CancelParticipation from "@/application/use-cases/cancel-participation";

import Game, {GameStatus} from "@/domain/entities/game";
import GameRepository from "@/domain/repositories/game-repository";
import Player from "@/domain/entities/player";

import GameRepositoryMemory from "@/infrastructure/repositories/game-repository-memory";

const GAME_DATA = {
  description : undefined,
  startDate : new Date(Date.now() + 1000 * 60 * 60 * 12),
  gameMode : "MilSim",
  fieldId : "123",
  status : GameStatus.SCHEDULED,
  id : "1",
};

const PLAYER_DATA = {
  motto : 'undefined ;)',
  honor : 6,
  name : 'Player 1',
  id : '1',
}

describe("Leave Game", function () {
  it("Deve remover um jogador de uma partida agendada", async function () {
    const [gameId, playerId] = ["1", "1"];
    const gameRepository = new GameRepositoryMemory([new Game({...GAME_DATA, id : '1', playerList : ['1']})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const cancelParticipation = new CancelParticipation(gameRepository, playerRepositoryStub);
    const game = await cancelParticipation.execute(gameId, playerId);
    expect(game.playerList).toEqual([]);
  });

  it("Não deve remover um jogador que não esteja na partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...GAME_DATA, id : '1', playerList : []})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const cancelParticipation = new CancelParticipation(gameRepository, playerRepositoryStub);
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("PLAYER_NOT_IN_GAME")
  });

  it("Não deve remover um jogador de uma partida não existente", async function () {
    const gameRepositoryStub = {findById : (gameId: string) => Promise.resolve(null)} as GameRepository;
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const cancelParticipation = new CancelParticipation(gameRepositoryStub, playerRepositoryStub);
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("GAME_NOT_FOUND")
  });

  it("Não deve remover um jogador inexistente de um partida", async function () {
    const gameRepository = new GameRepositoryMemory([new Game({...GAME_DATA, id : '1'})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(null)};
    const cancelParticipation = new CancelParticipation(gameRepository, playerRepositoryStub);
    await expect(cancelParticipation.execute('1', '1')).rejects.toThrow("PLAYER_NOT_FOUND");
  });

  it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))("Não deve remover um jogador em uma partida com status diferente de SCHEDULED", async function (status) {
    const gameRepository = new GameRepositoryMemory([new Game({...GAME_DATA, id : '1', status, playerList : ['1']})]);
    const playerRepositoryStub = {findById : () => Promise.resolve(new Player(PLAYER_DATA))}
    const cancelParticipation = new CancelParticipation(gameRepository, playerRepositoryStub);
    await expect(cancelParticipation.execute("1", "1")).rejects.toThrow('GAME_NOT_IN_SCHEDULED_STATUS');
  });

})