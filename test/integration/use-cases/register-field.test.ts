import Field from "@/domain/entities/field";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import AdminRepositoryMemory from "@/infrastructure/repositories/admin-repository-memory";
import RegisterField from "@/application/use-cases/field/register-field";

describe('Registrar Campo', function () {
  const idGenerator = {generate : () => '1'};

  it('Deve registrar um campo', async function () {
    const adminRepository = new AdminRepositoryMemory();
    const registerField = new RegisterField(new FieldRepositoryMemory(), adminRepository, idGenerator);
    const props = {
      infrastructure : 'bath',
      description : 'incredible',
      address : 'rua x, n 1234, bairro y',
      adminId : '1',
      photos : [''],
      rules : 'cannot highland',
      name : 'awesome field'
    };
    const field = await registerField.execute(props);
    expect(field).toBeInstanceOf(Field);
  });

  it('Não deve registrar um campo com admin inexistente', async function () {
    const adminRepository = new AdminRepositoryMemory([]);
    const registerField = new RegisterField(new FieldRepositoryMemory(), adminRepository, idGenerator);
    const props = {
      infrastructure : 'bath',
      description : 'incredible',
      address : 'rua x, n 1234, bairro y',
      adminId : '1',
      photos : [''],
      rules : 'cannot highland',
      name : 'awesome field'
    };
    await expect(registerField.execute(props)).rejects.toThrow('ADMIN_NOT_FOUND');
  });

});
