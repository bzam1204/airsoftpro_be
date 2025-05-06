import CreateUser from "@/application/use-cases/create-user";
import User from "@/domain/entities/user";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

describe('Criar Usuário', function () {
  
  it('Deve criar um usuário', async function () {
    const userRepository = new UserRepositoryMemory();
    const idGenerator = {generate: () => '1'};
    const createUser = new CreateUser(userRepository, idGenerator);
    const props = {name: 'user', photo: '', email: '', password: '', fullName: 'user of system', birth: new Date()};
    const user = await createUser.execute(props);
    expect(user).toBeInstanceOf(User);
  });

  it('Não deve criar 2 usuários com o mesmo nome', async function () {
    const userRepository = new UserRepositoryMemory();
    const idGenerator = {generate: () => '1'};
    const createUser = new CreateUser(userRepository, idGenerator);
    const props = {name: 'user', photo: '', email: '', password: '', fullName: 'user of system', birth: new Date()};
    const user = await createUser.execute(props);
    await expect(createUser.execute(props)).rejects.toThrow('NAME_ALREADY_IN_USE');
  });
  
});
