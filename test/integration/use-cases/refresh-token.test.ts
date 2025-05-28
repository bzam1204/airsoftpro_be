import RefreshToken from "@/application/use-cases/auth/refresh-token";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import ValidateToken from "@/application/use-cases/auth/validate-token";

describe('Renovar o token', function () {

  it('Deve renovar o token se for válido', async function () {
    const tokenProviderStub = {
      signRefreshToken : () => '321321',
      signAccessToken : () => '123123',
      verifyAccessToken : jest.fn(),
      verifyRefreshToken : jest.fn(),
      decode : () => ({
        sub : '1',
        email : 'user@example.com',
        playerName : 'player1',
        roles : ['PLAYER', 'ADMIN'],
      }),
    };
    const playerRepository = new PlayerRepositoryMemory();
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const validateToken = {execute : () => true} as unknown as ValidateToken;
    const refresh = new RefreshToken(fieldAdminRepository, playerRepository, tokenProviderStub, validateToken);
    const {accessToken, refreshToken} = await refresh.execute('123123');
    expect(accessToken).toBe('123123');
    expect(refreshToken).toBe('321321');
  });

});
