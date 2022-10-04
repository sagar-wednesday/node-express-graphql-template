import db from '@database/models';
import { insertBook, updateBook } from '../books';

describe('Authors dao tests', () => {
  it('should create authors', async () => {
    const name = 'glitter in sky';
    const genres = 'action';
    const pages = '101';
    const publisherId = 1;

    const bookArgs = {
      name,
      genres,
      pages,
      publisherId
    };

    const mock = jest.spyOn(db.books, 'create');
    await insertBook(bookArgs);
    expect(mock).toHaveBeenCalledWith(bookArgs);
  });

  it('should update authors', async () => {
    const id = 1;
    const name = 'glitter in sky';
    const genres = 'action';
    const pages = '101';
    const publisherId = 1;

    const bookArgs = {
      id,
      name,
      genres,
      pages,
      publisherId
    };

    const mock2 = jest.spyOn(db.books, 'update');
    await updateBook(bookArgs, { fetchUpdated: true });

    const expectedArgs = { name, genres, pages, publisherId };

    expect(mock2).toHaveBeenCalledWith(expectedArgs, { where: { id }, returning: true });
  });
});
