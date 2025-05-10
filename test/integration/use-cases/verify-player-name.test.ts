import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import VerifyPlayerName from "@/application/use-cases/verify-player-name";
import Player from "@/domain/entities/player";
import playerProps from "@test/shared/player-props";

describe('Verificar disponibilidade do nome de jogador', function () {

  it('Deve retornar true se o nome estiver disponível ', async function () {
    const verify = new VerifyPlayerName(new PlayerRepositoryMemory([]));
    const verification = await verify.execute('available_name');
    expect(verification).toBe(true);
  });

  it('Deve retornar false se o nome estiver sendo usado', async function () {
    const verify = new VerifyPlayerName(new PlayerRepositoryMemory([new Player({...playerProps, name : 'used_name'})]));
    const verification = await verify.execute('used_name');
    expect(verification).toBe(false);
  });

});
