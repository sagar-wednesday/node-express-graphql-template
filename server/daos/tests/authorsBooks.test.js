import db from '@database/models';
import { resetAndMockDB } from '@server/utils/testUtils';
import { insertAuthorsBooks, updateAuthorsBooksForAuthors, updateAuthorsBooksForBooks } from '../authorsBooks';
import { booksAuthorsArgs } from './mockDaoData';

describe('authorsBooks dao tests', () => {
  describe('createAuthorsBooks', () => {
    let createArgs;
    beforeEach(() => {
      createArgs = booksAuthorsArgs.create;
    });
    it('should insertAuthorsBooks called with args and create authorsBooks', async () => {
      let createAuthorsBookSpy;

      await resetAndMockDB(db => {
        createAuthorsBookSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
      });

      const { insertAuthorsBooks } = require('../authorsBooks');

      const res = await insertAuthorsBooks(createArgs);

      expect(createAuthorsBookSpy).toHaveBeenCalledWith(createArgs);
      expect(res).toMatchObject({
        ...createArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const createAuthorsBookSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');
      const errorMessage = 'database is down';

      createAuthorsBookSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => insertAuthorsBooks(createArgs)).rejects.toEqual(new Error(errorMessage));
    });
  });

  describe('updateAuthorsBooks', () => {
    let updateArgs;
    beforeEach(() => {
      updateArgs = booksAuthorsArgs.update;
    });

    describe('updateAuthorsBooks for books', () => {
      it('should have been called with args and update authorsBooks for books', async () => {
        let authorsBooksForBooksSpy;
        await resetAndMockDB(db => {
          authorsBooksForBooksSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
        });

        const { updateAuthorsBooksForBooks } = require('../authorsBooks');
        const res = await updateAuthorsBooksForBooks(updateArgs);

        expect(authorsBooksForBooksSpy).toHaveBeenCalledWith(updateArgs, {
          fields: ['id', 'bookId', 'authorId'],
          updateOnDuplicate: ['bookId']
        });
        expect(res).toMatchObject({
          ...updateArgs
        });
      });

      it('should throw an error if the database is down', async () => {
        const authorsBooksForBooksSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');

        const errorMessage = 'database is down';

        authorsBooksForBooksSpy.mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        expect(async () => updateAuthorsBooksForBooks(updateArgs)).rejects.toEqual(new Error(errorMessage));
      });
    });

    describe('updateAuthorsBooks for authors', () => {
      let authorsBooksForAuthorsSpy;

      it('should have been called with args and update authorsBooks for authors', async () => {
        await resetAndMockDB(db => {
          authorsBooksForAuthorsSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
        });

        const { updateAuthorsBooksForAuthors } = require('../authorsBooks');
        const res = await updateAuthorsBooksForAuthors(updateArgs);

        expect(authorsBooksForAuthorsSpy).toHaveBeenCalledWith(updateArgs, {
          fields: ['id', 'bookId', 'authorId'],
          updateOnDuplicate: ['authorId']
        });
        expect(res).toMatchObject({
          ...updateArgs
        });
      });

      it('should throw an error if the database is down', async () => {
        authorsBooksForAuthorsSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');

        const errorMessage = 'database is down';

        authorsBooksForAuthorsSpy.mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        expect(async () => updateAuthorsBooksForAuthors(updateArgs)).rejects.toEqual(new Error(errorMessage));
      });
    });
  });
});
