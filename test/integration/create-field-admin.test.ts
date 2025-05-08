import CreateFieldAdmin from "@/application/use-cases/create-field-admin";

import FieldAdmin from "@/domain/entities/field-admin";
import User from "@/domain/entities/user";

import FieldAdminRepositoryMemory from "@/infrastructure/repositories/field-admin-repository-memory";
import UserRepositoryMemory from "@/infrastructure/repositories/user-repository-memory";

import userProps from "@test/shared/user-props";

describe('Criar Administrador de Campo', function () {

  it('Deve criar um administrador de campo', async function () {
    const idGenerator = {generate : () => '1'};
    const userRepository = new UserRepositoryMemory([new User({...userProps, id : '1'})]);
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const createFieldAdmin = new CreateFieldAdmin(fieldAdminRepository, userRepository, idGenerator);
    const props = {userId : '1'};
    const {fieldAdmin} = await createFieldAdmin.execute(props);
    expect(fieldAdmin).toBeInstanceOf(FieldAdmin);
  });

  it('Não deve criar um administrador de campo com user inexistente', async function () {
    const idGenerator = {generate : () => '1'};
    const userRepository = new UserRepositoryMemory([]);
    const fieldAdminRepository = new FieldAdminRepositoryMemory();
    const createFieldAdmin = new CreateFieldAdmin(fieldAdminRepository, userRepository, idGenerator);
    const props = {userId : '1'};
    await expect(createFieldAdmin.execute(props)).rejects.toThrow('USER_NOT_FOUND');
  });

  it('Não deve criar um administrador de campo se o user já tem um perfil de admin de campo', async function () {
    const idGenerator = {generate : () => '1'};
    const userRepository = new UserRepositoryMemory([new User({...userProps, id : '1'})]);
    const fieldAdminRepository = new FieldAdminRepositoryMemory([new FieldAdmin({userId : '1', id : '1'})]);
    const createFieldAdmin = new CreateFieldAdmin(fieldAdminRepository, userRepository, idGenerator);
    const props = {userId : '1'};
    await expect(createFieldAdmin.execute(props)).rejects.toThrow('FIELD_ADMIN_ALREADY_EXISTS');
  });

});
