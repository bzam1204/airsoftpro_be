import Game, {GameStatus} from "@/domain/entities/game";
import GameRules from "@/domain/entities/game-rules";

import gameData from "@test/shared/game-data";

describe('Partida', function () {

  describe('Criar', function () {

    it('Deve criar uma partida', function () {
      const game = new Game(gameData);
      expect(game).toBeDefined();
    });

    it('Não deve criar partida com horário de início menor que agora.', function () {
      expect(() => new Game({
        ...gameData,
        startDate : new Date(Date.now() - 1000 * 60)
      })).toThrow('INVALID_START_DATE');
    });

  });

  describe('Adicionar Jogador', function () {

    it("Deve adicionar um jogador a uma partida", function () {
      const game = new Game(gameData);
      game.addPlayerParticipation("1");
      expect(game.playerList.length).toBe(1);
    });

    it("Não deve adicionar mais jogadores que o limite permitido", function () {
      const game = new Game({...gameData, gameRules : new GameRules({playersLimit : 2})});
      game.addPlayerParticipation("1");
      game.addPlayerParticipation("2");
      expect(() => game.addPlayerParticipation("3")).toThrow('GAME_FULL')
    });

    it("Não deve adicionar o mesmo jogador na partida", function () {
      const game = new Game(gameData);
      game.addPlayerParticipation("1");
      expect(() => game.addPlayerParticipation("1")).toThrow('PLAYER_ALREADY_IN_GAME')
    });

  });

  describe('Remover Jogador', function () {

    it("Deve remover um jogador de uma partida", function () {
      const game = new Game(gameData);
      game.addPlayerParticipation("1");
      game.removePlayer("1");
      expect(game.playerList.length).toBe(0);
    })

    it("Não deve remover um jogador que não esteja na partida", function () {
      const game = new Game(gameData);
      expect(() => game.removePlayer("1")).toThrow('PLAYER_NOT_IN_GAME');
    })

  });

  describe('Iniciar', function () {

    it('Deve iniciar uma partida', function () {
      const game = new Game(gameData);
      game.addPlayerParticipation("1");
      game.addPlayerParticipation("2");
      game.start();
      expect(game.status).toBe(GameStatus.IN_PROGRESS);
    });

    it.each(Object.values(GameStatus).filter(p => p !== GameStatus.SCHEDULED))("Não deve iniciar uma partida cujo status seja diferente de SCHEDULED", function (status) {
      const game = new Game({...gameData, status});
      expect(() => game.start()).toThrow('GAME_NOT_IN_SCHEDULED_STATUS')
    });

    it("Não deve iniciar uma partida com menos de 2 jogadores", function () {
      const game = new Game(gameData);
      expect(() => game.start()).toThrow('INSUFFICIENT_PLAYERS');
    });

  });

  describe('Encerrar', function () {

    it("Deve encerrar uma partida", function () {
      const game = new Game(gameData);
      game.addPlayerParticipation("1");
      game.addPlayerParticipation("2");
      game.start();
      game.finish();
      expect(game.status).toBe(GameStatus.COMPLETED);
    });

    it.each(Object.values(GameStatus).filter(p => p !== GameStatus.IN_PROGRESS))("Não deve encerrar uma partida que não esteja em andamento", function (status) {
      const game = new Game({...gameData, status});
      expect(() => game.finish()).toThrow('GAME_NOT_IN_PROGRESS');
    });

  });

  describe('Cancelar', function () {

    it("Deve cancelar uma partida", function () {
      const game = new Game(gameData);
      game.cancel();
      expect(game.status).toBe(GameStatus.CANCELLED);
    });

    it.each(Object.values(GameStatus).filter(p => p !== GameStatus.IN_PROGRESS && p !== GameStatus.SCHEDULED))("Não deve cancelar uma partida que não esteja agendada ou em andamento", function (status) {
      const game = new Game({...gameData, status});
      expect(() => game.cancel()).toThrow('INVALID_STATUS_TO_CANCEL');
    });

  })

});
