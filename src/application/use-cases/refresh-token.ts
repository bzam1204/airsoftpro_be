import TokenProvider from "@/application/services/token-provider";

import FieldAdminRepository from "@/domain/repositories/field-admin-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import ValidateToken from "@/application/use-cases/validate-token";

export default class RefreshToken {

  constructor(
      private readonly fieldAdminRepository: FieldAdminRepository,
      private readonly playerRepository: PlayerRepository,
      private readonly tokenProvider: TokenProvider,
      private readonly validateToken: ValidateToken
  ) {
  }

  async execute(token: string): Promise<Output> {
    if (! await this.isTokenValid(token)) throw new Error('INVALID_TOKEN');
    const {sub : userId, email} = this.tokenProvider.decode(token);
    const player = await this.playerRepository.findByUserId(userId);
    if (!player) throw new Error('PLAYER_NOT_EXISTS');
    const payload = {
      sub : userId,
      email,
      roles : await this.getUserRoles(userId),
      playerName : player.name,
    };
    return {
      accessToken : this.tokenProvider.signAccessToken(payload),
      refreshToken : this.tokenProvider.signRefreshToken(payload),
    };
  };

  private async getUserRoles(userId: string): Promise<string[]> {
    const roles: string[] = [];
    const player = await this.playerRepository.findByUserId(userId);
    const fieldAdmin = await this.fieldAdminRepository.findByUserId(userId);
    if (player) roles.push('PLAYER');
    if (fieldAdmin) roles.push('FIELD_ADMIN');
    return roles;
  };

  private async isTokenValid(token: string) {
    return await this.validateToken.execute(token);
  };
  
};

interface Output {
  accessToken: string;
  refreshToken: string;
}

export interface Payload {
  sub: string;
  email: string;
  roles: string[];
  playerName: string;
}
