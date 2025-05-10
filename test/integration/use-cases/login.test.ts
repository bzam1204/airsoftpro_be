import User from "@/domain/entities/user";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

import userProps from "@test/shared/user-props";
import Login from "@/application/use-cases/login";

describe('Entrar', function () {

  it('Deve entrar no sistema', async function () {
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const playerRepository = new PlayerRepositoryMemory();
    const userRepository = new UserRepositoryMemory([new User({...userProps, email : 'user@example.com', id : '1'})]);
    const hashingServiceStub = {hash : () => Promise.resolve('123'), compare : () => Promise.resolve(true)};
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      validate : jest.fn(),
      decode : jest.fn(),
    };
    const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingServiceStub, tokenProviderStub);
    const credentials = {email : 'user@example.com', password : '123123'};
    const {accessToken, refreshToken} = await login.execute(credentials);
    expect(accessToken).toBe('123123');
    expect(refreshToken).toBe('321321');
  });

  it('Não deve entrar no sistema com senha incorreta', async function () {
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const playerRepository = new PlayerRepositoryMemory();
    const userRepository = new UserRepositoryMemory([new User({...userProps, email : 'user@example.com', id : '1'})]);
    const hashingServiceStub = {hash : () => Promise.resolve('123'), compare : () => Promise.resolve(false)};
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      validate : jest.fn(),
      decode : jest.fn(),
    };
    const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingServiceStub, tokenProviderStub);
    const credentials = {email : 'user@example.com', password : '123123'};
    await expect(login.execute(credentials)).rejects.toThrow('INVALID_CREDENTIALS');
  });

  it('Não deve entrar no sistema com email incorreto', async function () {
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const playerRepository = new PlayerRepositoryMemory();
    const userRepository = new UserRepositoryMemory([new User({...userProps, email : 'user@example.com', id : '1'})]);
    const hashingServiceStub = {hash : () => Promise.resolve('123'), compare : () => Promise.resolve(false)};
    const tokenProviderStub = {
      signAccessToken : () => '123123',
      signRefreshToken : () => '321321',
      validate : jest.fn(),
      decode : jest.fn(),
    };
    const login = new Login(fieldAdminRepository, playerRepository, userRepository, hashingServiceStub, tokenProviderStub);
    const credentials = {email : 'wrong_email', password : '123123'};
    await expect(login.execute(credentials)).rejects.toThrow('INVALID_CREDENTIALS');
  });

});
