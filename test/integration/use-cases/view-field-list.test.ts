import ViewFieldList from "@/application/use-cases/view-field-list";

import Field from "@/domain/entities/field";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";

import fieldProps from "@test/shared/field-props";

describe('Ver Lista de Campos', function () {

  it('Deve ver uma lista de todos os campos', async function () {
    const fieldRepository = new FieldRepositoryMemory([new Field(fieldProps)]);
    const viewFieldList = new ViewFieldList(fieldRepository);
    const fields = await viewFieldList.execute();
    expect(fields.length).toBe(1);
  });

});
