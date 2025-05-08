import TokenProvider from "@/application/services/token-provider";
import CreatePlayer from "@/application/use-cases/create-player";
import CreateUser from "@/application/use-cases/create-user";

import Player from "@/domain/entities/player";
import User from "@/domain/entities/user";
import VerifyPlayerName from "@/application/use-cases/verify-player-name";

export default class RegisterNewUser {

  constructor(
      private readonly verifyPlayerName: VerifyPlayerName,
      private readonly tokenProvider: TokenProvider,
      private readonly createPlayer: CreatePlayer,
      private readonly createUser: CreateUser,
  ) {
  };

  async execute({playerName, ...userProps}: Input): Promise<Output> {
    if (!await this.verifyPlayerName.execute(playerName)) throw new Error('PLAYER_ALREADY_EXISTS');
    const user = await this.createUser.execute(userProps);
    const player = await this.createPlayer.execute({userId : user.id, name : playerName});
    const payload = {sub : user.id, email : user.email, playerName : player.name, roles : ['PLAYER']}
    return {
      user,
      player,
      accessToken : this.tokenProvider.signAccessToken(payload),
      refreshToken : this.tokenProvider.signRefreshToken(payload),
    };
  };

};

interface Input {
  playerName: string;
  password: string;
  fullName: string;
  birth: Date;
  photo: string;
  email: string;
}

interface Output {
  user: User;
  player: Player;
  accessToken: string;
  refreshToken: string;
}
