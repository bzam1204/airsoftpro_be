import Field from "@/domain/entities/field";

import FieldRepositoryMemory from "@/infrastructure/repositories/field-repository-memory";
import ViewField from "@/application/use-cases/field/view-field";

describe('Visualizar Campo', function () {
  
  it('Deve visualizar um campo', async function () {
    const viewField = new ViewField(new FieldRepositoryMemory());
    const field = await viewField.execute('1');
    expect(field).toBeInstanceOf(Field);
  });

  it('Não deve visualizar um campo inexistente', async function () {
    const viewField = new ViewField(new FieldRepositoryMemory());
    await expect(viewField.execute('invalid_id')).rejects.toThrow('FIELD_NOT_FOUND');
  });

});
