import db from '@database/models';
import { insertBook, updateBook } from '../books';

describe('Books dao tests', () => {
  const id = 1;
  const name = 'glitter in sky';
  const genres = 'action';
  const pages = '101';
  const publisherId = 1;
  let bookArgs;

  beforeEach(() => {
    bookArgs = {
      name,
      genres,
      pages,
      publisherId
    };
  });

  describe('createBook', () => {
    it('should create books', async () => {
      const createBookSpy = jest.spyOn(db.books, 'create');
      const res = await insertBook(bookArgs);
      expect(createBookSpy).toHaveBeenCalledWith(bookArgs);
      expect(res?.dataValues).toMatchObject({
        ...bookArgs,
        id: `${id}`
      });
    });

    it('should throw an error if the database is down', async () => {
      const createBookSpy = jest.spyOn(db.books, 'create');
      const errorMessage = 'database is down';
      createBookSpy.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      expect(async () => insertBook(bookArgs)).rejects.toThrowError(errorMessage);
      expect(createBookSpy).toHaveBeenCalledWith(bookArgs);
    });
  });

  describe('updateBook', () => {
    let updateBookSpy;
    let expectedArgs;
    beforeEach(() => {
      updateBookSpy = jest.spyOn(db.books, 'update');
      expectedArgs = {
        name,
        genres,
        pages,
        publisherId
      };
    });

    it('should update books when fetchUpdated = true', async () => {
      updateBookSpy = jest.spyOn(db.books, 'update');
      const res = await updateBook({ ...bookArgs, id }, { fetchUpdated: true });

      expect(updateBookSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id },
        returning: true
      });

      expect(res?.dataValues).toMatchObject({ ...expectedArgs, id: `${id}` });
    });

    it('should update books when fetchUpdated = false', async () => {
      updateBookSpy.mockImplementation(() => [1]);
      const res = await updateBook({ ...bookArgs, id });

      expect(updateBookSpy).toHaveBeenCalledWith(expectedArgs, {
        where: { id }
      });
      expect(res).toEqual([1]);
    });
  });
});
