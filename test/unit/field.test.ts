import Field from "@/domain/entities/field";

import fieldProps from "@test/shared/field-props";

describe('Campo', function () {

  it("Deve criar um campo", function () {
    const field = new Field(fieldProps);
    expect(field).toBeInstanceOf(Field);
  });

  it("Deve alterar o nome", function () {
    const field = new Field(fieldProps);
    const newName = 'NEW_NAME'
    field.changeName(newName);
    expect(field.name).toBe(newName);
  });
  
  it("Não deve alterar se for o mesmo nome", function () {
    const field = new Field(fieldProps);
    expect(() => field.changeName(field.name)).toThrow('NAMES_ARE_THE_SAME')
  });

  it("Deve alterar o adminId", function () {
    const field = new Field(fieldProps);
    const newAdminId = '999'
    field.changeAdminId(newAdminId);
    expect(field.adminId).toBe(newAdminId);
  });

  it("Não deve alterar se for o mesmo adminId", function () {
    const field = new Field(fieldProps);
    expect(() => field.changeAdminId(field.adminId)).toThrow('ADMIN_IDS_ARE_THE_SAME')
  });

});
