import User from "@/domain/entities/user";

import userProps from "@test/shared/user-props";

describe('Usuário', function () {

  it('Deve criar um usuário', function () {
    const user = new User({...userProps, id : '1'});
    expect(user).toBeInstanceOf(User);
  });

  it('Não deve criar um usuário se a data de nascimento for maior que agora', async function () {
    expect(() => new User({...userProps, birth : new Date(Date.now() + 1000 * 60), id : '1'})).toThrow('INVALID_BIRTH');
  });

});
