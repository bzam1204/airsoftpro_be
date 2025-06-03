import FieldAdminRepository from "@/domain/repositories/field-admin-repository";
import PlayerRepository from "@/domain/repositories/player-repository";
import UserRepository from "@/domain/repositories/user-repository";
import HashingService from "@/application/services/hashing-service";
import TokenProvider from "@/application/services/token-provider";
import {inject, injectable} from "tsyringe";
import {
  FIELD_ADMIN_REPOSITORY,
  HASHING_SERVICE,
  PLAYER_REPOSITORY, TOKEN_PROVIDER,
  USER_REPOSITORY
} from "@/shared/constants/constants";

@injectable()
export default class Login {

  constructor(
      @inject(FIELD_ADMIN_REPOSITORY) private readonly fieldAdminRepository: FieldAdminRepository,
      @inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
      @inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
      @inject(HASHING_SERVICE) private readonly hashingService: HashingService,
      @inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider,
  ) {``
  }

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new Error('INVALID_CREDENTIALS');
    if (!await this.isValidPassword(input.password, user.password)) throw new Error('INVALID_CREDENTIALS');
    const player = await this.playerRepository.findByUserId(user.id);
    if (!player) throw new Error('PLAYER_NOT_EXISTS');
    const payload = {
      sub : user.id,
      email : user.email,
      playerName : player.name,
      roles : await this.getUserRoles(user.id)
    };
    return {
      accessToken : this.tokenProvider.signAccessToken(payload),
      refreshToken : this.tokenProvider.signRefreshToken(payload),
    };

  };

  private isValidPassword(password: string, hash: string) {
    return this.hashingService.compare(password, hash);
  };

  private async getUserRoles(userId: string): Promise<string[]> {
    const roles: string[] = [];
    const player = await this.playerRepository.findByUserId(userId);
    const fieldAdmin = await this.fieldAdminRepository.findByUserId(userId);
    if (player) roles.push('PLAYER');
    if (fieldAdmin) roles.push('FIELD_ADMIN');
    return roles;
  };

};

interface Input {
  email: string;
  password: string;
}

interface Output {
  accessToken: string;
  refreshToken: string;
}