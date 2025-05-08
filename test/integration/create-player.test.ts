import Player from "@/domain/entities/player";
import User from "@/domain/entities/user";

import PlayerRepositoryMemory from "@/infrastructure/repositories/player-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

import userProps from "@test/shared/user-props";
import CreatePlayer from "@/application/use-cases/create-player";

describe('Criar Jogador', function () {
  const userRepository = new UserRepositoryMemory([new User({...userProps, id : '2',})]);

  it('Deve criar um jogador', async function () {
    const idGenerator = {generate : () => '1'};
    const props = {userId : '2', motto : 'life is good!', name : 'player1',};
    const createPlayer = new CreatePlayer(new PlayerRepositoryMemory([]), userRepository, idGenerator);
    const player = await createPlayer.execute(props);
    expect(player).toBeInstanceOf(Player);
  });

  it('Não deve criar um jogador com nome já existente', async function () {
    const idGenerator = {generate : () => '1'};
    const props = {userId : '2', motto : 'life is good!', name : 'player1'};
    const createPlayer = new CreatePlayer(new PlayerRepositoryMemory([]), userRepository, idGenerator);
    await createPlayer.execute(props);
    await expect(createPlayer.execute(props)).rejects.toThrow('PLAYER_ALREADY_EXISTS');
  });

  it('Não deve criar um jogador com o mesmo userId que outro já existente', async function () {
    const idGenerator = {generate : () => '1'};
    const props = {userId : '2', motto : 'life is good!', name : 'player1'};
    const createPlayer = new CreatePlayer(new PlayerRepositoryMemory([]), userRepository, idGenerator);
    await createPlayer.execute({...props, name : 'player2'});
    await expect(createPlayer.execute(props)).rejects.toThrow('PLAYER_ALREADY_EXISTS');
  });

  it('Não deve criar um jogador com usuário inexistente', async function () {
    const idGenerator = {generate : () => '1'};
    const props = {userId : '999', motto : 'life is good!', name : 'player1'};
    const createPlayer = new CreatePlayer(new PlayerRepositoryMemory([]), userRepository, idGenerator);
    await expect(createPlayer.execute(props)).rejects.toThrow('USER_NOT_FOUND');
  });

});
