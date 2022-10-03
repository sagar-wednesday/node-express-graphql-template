import db from '@database/models';
import { insertAuthor, updateAuthor } from '../authors';

describe('Authors dao tests', () => {
  it('should create authors', async () => {
    const name = 'sagar';
    const country = 'India';
    const age = '24';

    const authorArgs = {
      name,
      country,
      age
    };

    const mock = jest.spyOn(db.authors, 'create');
    await insertAuthor(authorArgs);
    expect(mock).toHaveBeenCalledWith(authorArgs);
  });

  it('should update authors', async () => {
    const id = 1;
    const name = 'sagar';
    const country = 'India';
    const age = '24';

    const authorArgs = {
      id,
      name,
      country,
      age
    };

    const mock2 = jest.spyOn(db.authors, 'update');
    await updateAuthor(authorArgs);

    const expectedArgs = { age, country, name };

    expect(mock2).toHaveBeenCalledWith(expectedArgs, { where: { id } });
  });
});
