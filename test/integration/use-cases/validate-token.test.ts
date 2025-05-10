import ValidateToken from "@/application/use-cases/validate-token";

describe('Validar o token', function () {

  it('Deve retornar true se o token for válido', async function () {
    const tokenProviderStub = {
      signRefreshToken : jest.fn(),
      signAccessToken : jest.fn(),
      verifyAccessToken : () => true,
      verifyRefreshToken : () => true,
      decode: jest.fn(),
    };
    const validate = new ValidateToken(tokenProviderStub);
    const token = '123123';
    const validation = await validate.execute(token);
    expect(validation).toBe(true);
  });
  
  it('Deve retornar false se o token for inválido', async function () {
    const tokenProviderStub = {
      signRefreshToken : jest.fn(),
      signAccessToken : jest.fn(),
      verifyAccessToken : () => false,
      verifyRefreshToken : () => false,
      decode: jest.fn(),
    };
    const validate = new ValidateToken(tokenProviderStub);
    const token = '123123';
    const validation = await validate.execute(token);
    expect(validation).toBe(false);
  });

});
