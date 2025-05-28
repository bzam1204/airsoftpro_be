import Player from "@/domain/entities/player";
import User from "@/domain/entities/user";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

import playerProps from "@test/shared/player-props";
import RegisterUser from "@/application/use-cases/auth/register-user";
import CreatePlayer from "@/application/use-cases/player/create-player";
import VerifyPlayerName from "@/application/use-cases/player/verify-player-name";
import CreateUser from "@/application/use-cases/auth/create-user";

describe('Registrar novo user', function () {

  it('Deve registrar um novo user', async function () {
    const playerRepository = new PlayerRepositoryMemory([]);
    const hashingService = new HashingServiceBcryptjs();
    const userRepository = new UserRepositoryMemory([]);
    const idGenerator = {generate : () => '1'};
    const createUser = new CreateUser(userRepository, hashingService, idGenerator);
    const createPlayer = new CreatePlayer(playerRepository, userRepository, idGenerator);
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      verifyAccessToken : jest.fn(),
      verifyRefreshToken : jest.fn(),
      decode : jest.fn(),
    };
    const verifyPlayerName = new VerifyPlayerName(playerRepository);
    const registerNewUser = new RegisterUser(verifyPlayerName, tokenProviderStub, createPlayer, createUser);
    const props = {
      playerName : 'player1',
      password : '123123',
      fullName : 'User Player Admin',
      birth : new Date('2000-09-21T08:00:00'),
      photo : '',
      email : 'user@example.com',
    };

    const {player, user, accessToken, refreshToken} = await registerNewUser.execute(props);
    expect(refreshToken).toBe('321321');
    expect(accessToken).toBe('123123');
    expect(player).toBeInstanceOf(Player);
    expect(user).toBeInstanceOf(User);
  });

  it('Não deve criar um novo usuário se a data de nascimento for maior que agora', async function () {
    const playerRepository = new PlayerRepositoryMemory([]);
    const hashingService = new HashingServiceBcryptjs();
    const userRepository = new UserRepositoryMemory([]);
    const idGenerator = {generate : () => '1'};
    const verifyPlayerName = new VerifyPlayerName(playerRepository);
    const createUser = new CreateUser(userRepository, hashingService, idGenerator);
    const createPlayer = new CreatePlayer(playerRepository, userRepository, idGenerator);
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      verifyAccessToken : jest.fn(),
      verifyRefreshToken : jest.fn(),
      decode : jest.fn(),
    };
    const registerNewUser = new RegisterUser(verifyPlayerName, tokenProviderStub, createPlayer, createUser);
    const props = {
      playerName : 'player1',
      password : '123123',
      fullName : 'User Player Admin',
      birth : new Date(Date.now() + 1000 * 60),
      photo : '',
      email : 'user@example.com',
    };
    await expect(registerNewUser.execute(props)).rejects.toThrow('INVALID_BIRTH');
  });

  it('Não deve criar um novo usuário se o nome do jogador não estiver disponível', async function () {
    const playerRepository = new PlayerRepositoryMemory([new Player({...playerProps, name : 'used_name'})]);
    const hashingService = new HashingServiceBcryptjs();
    const userRepository = new UserRepositoryMemory([]);
    const idGenerator = {generate : () => '1'};
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      verifyAccessToken : jest.fn(),
      verifyRefreshToken : jest.fn(),
      decode : jest.fn(),
    };
    const verifyPlayerName = new VerifyPlayerName(playerRepository);
    const createPlayer = new CreatePlayer(playerRepository, userRepository, idGenerator);
    const createUser = new CreateUser(userRepository, hashingService, idGenerator);
    const registerNewUser = new RegisterUser(verifyPlayerName, tokenProviderStub, createPlayer, createUser);
    const props = {
      playerName : 'used_name',
      password : '123123',
      fullName : 'User Player Admin',
      birth : new Date('2000-09-21T08:00:00'),
      photo : '',
      email : 'user@example.com',
    };
    await expect(registerNewUser.execute(props)).rejects.toThrow('PLAYER_ALREADY_EXISTS');
    await expect(userRepository.count()).resolves.toBe(0);
    await expect(playerRepository.count()).resolves.toBe(1);
  });

});
