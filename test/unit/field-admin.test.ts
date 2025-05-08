import FieldAdmin from "@/domain/entities/field-admin";

describe('Administrador de campo', function () {

  it('Deve criar um administrador de campo', function () {
    const admin = new FieldAdmin({userId : '1', id : '1'});
    expect(admin).toBeInstanceOf(FieldAdmin);
  });
  
});
