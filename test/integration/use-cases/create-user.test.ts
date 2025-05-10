import CreateUser from "@/application/use-cases/create-user";

import User from "@/domain/entities/user";

import HashingServiceBcryptjs from "@/infrastructure/services/hashing-service-bcryptjs";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

describe('Criar Usuário', function () {
  const hashingService = new HashingServiceBcryptjs();

  it('Deve criar um usuário', async function () {
    const userRepository = new UserRepositoryMemory();
    const idGenerator = {generate: () => '1'};
    const createUser = new CreateUser(userRepository,hashingService, idGenerator);
    const props = {name: 'user', photo: '', email: '', password: '', fullName: 'user of system', birth: new Date()};
    const user = await createUser.execute(props);
    expect(user).toBeInstanceOf(User);
  });

  it('Deve encriptar a senha do usuário', async function () {
    const userRepository = new UserRepositoryMemory();
    const idGenerator = {generate: () => '1'};
    const createUser = new CreateUser(userRepository, hashingService, idGenerator);
    const props = {name: 'user', photo: '', email: '', password: '123456', fullName: 'user of system', birth: new Date()};
    const user = await createUser.execute(props);
    const comparison = await hashingService.compare(props.password, user.password);
    expect(comparison).toBe(true);
  });

  it('Não deve criar um usuário se a data de nascimento for maior que agora', async function () {
    const userRepository = new UserRepositoryMemory();
    const idGenerator = {generate: () => '1'};
    const createUser = new CreateUser(userRepository,hashingService, idGenerator);
    const props = {name: 'user', photo: '', email: '', password: '', fullName: 'user of system', birth: new Date(Date.now() + 1000 * 60)};
    await expect(createUser.execute(props)).rejects.toThrow('INVALID_BIRTH');
  });
  
});
