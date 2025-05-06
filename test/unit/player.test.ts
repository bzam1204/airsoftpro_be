import Player from "@/domain/entities/player";

import playerProps from "@test/shared/player-props";

describe('Player', function () {

  it('Deve criar um jogador', function () {
    const player = new Player(playerProps);
    expect(player).toBeDefined();
  });

  it('Não deve criar um jogador com honra negativa', function () {
    expect(() => new Player({...playerProps, honorLevel : -1})).toThrow('HONOR_CANNOT_BE_NEGATIVE');
  });

  it('Não deve criar um jogador com tolerância negativa', function () {
    expect(() => new Player({...playerProps, tolerance : -1})).toThrow('TOLERANCE_CANNOT_BE_NEGATIVE');
  });

  it('Não deve criar um jogador com tolerância negativa', function () {
    expect(() => new Player({...playerProps, tolerance : -1})).toThrow('TOLERANCE_CANNOT_BE_NEGATIVE');
  });

  it('Deve remover um ponto de tolerância', function () {
    const player = new Player({...playerProps, tolerance : 10});
    player.removeTolerance();
    expect(player.tolerance).toBe(9);
  });

  it('Deve resetar a tolerância e diminuir um ponto de honra se a tolerância for igual a 0', function () {
    const player = new Player({...playerProps, honorLevel : 6, tolerance : 1});
    player.removeTolerance();
    expect(player.tolerance).toBe(10);
    expect(player.honorLevel).toBe(5);
  });

});
