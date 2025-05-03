import Game from "@/domain/entities/game";
import GameRules from "@/domain/entities/game-rules";

describe('Game Rules', function () {

  it("Não deve criar regras de partida com limite de jogadores menor que 2", function () {
    expect(() => new GameRules({playersLimit : 1})).toThrow('INVALID_PLAYER_LIMIT');
  });

  it("Não deve criar regras de partida com limite de fps inferior a 200", function () {
    expect(() => new GameRules({fpsLimit : 199})).toThrow('INVALID_FPS_LIMIT');
  });

})