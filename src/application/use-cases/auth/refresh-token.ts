import TokenProvider from "@/application/services/token-provider";

import FieldAdminRepository from "@/domain/repositories/field-admin-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import ValidateToken from "@/application/use-cases/auth/validate-token";
import {inject, injectable} from "tsyringe";
import {FIELD_ADMIN_REPOSITORY, PLAYER_REPOSITORY, TOKEN_PROVIDER, VALIDATE_TOKEN} from "@/shared/constants/constants";

@injectable()
export default class RefreshToken {

  constructor(
      @inject(FIELD_ADMIN_REPOSITORY) private readonly fieldAdminRepository: FieldAdminRepository,
      @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
      @inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider,
      @inject(VALIDATE_TOKEN) private readonly validateToken: ValidateToken
  ) {
  }

  async execute(token: string): Promise<Output> {
    if (!await this.isTokenValid(token)) throw new Error('INVALID_TOKEN');
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
  playerName: string;
  roles: string[];
  email: string;
  sub: string;
}

