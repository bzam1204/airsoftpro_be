import RefreshToken from "@/application/use-cases/refresh-token";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";

describe('Renovar o token', function () {

  it('Deve renovar o token se for válido', async function () {
    const tokenProviderStub = {
      signRefreshToken : () => '321321',
      signAccessToken : () => '123123',
      validate : () => true,
      decode : () => ({
        sub : '1',
        email : 'user@example.com',
        playerName : 'player1',
        roles : ['PLAYER', 'ADMIN'],
      }),
    };
    const playerRepository = new PlayerRepositoryMemory();
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const refresh = new RefreshToken(fieldAdminRepository, playerRepository, tokenProviderStub);
    const {accessToken, refreshToken} = await refresh.execute('123123');
    expect(accessToken).toBe('123123');
    expect(refreshToken).toBe('321321');
  });

});
