import User from "@/domain/entities/user";

import userProps from "@test/shared/user-props";

describe('Usuário', function () {

  it('Deve criar um usuário', function () {
    const user = new User({...userProps, id: '1'});
    expect(user).toBeInstanceOf(User);
  });
  
});
