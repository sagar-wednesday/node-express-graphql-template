import db from '@database/models';
import { resetAndMockDB } from '@server/utils/testUtils';
import { insertAuthorsBooks, updateAuthorsBooksForAuthors, updateAuthorsBooksForBooks } from '../authorsBooks';

describe('authorsBooks dao tests', () => {
  describe('createAuthorsBooks', () => {
    let authorsBooksArgs;
    beforeEach(() => {
      authorsBooksArgs = [
        {
          bookId: 1,
          authorId: 1
        }
      ];
    });
    it('should insertAuthorsBooks called with args and create authorsBooks', async () => {
      let createAuthorsBookSpy;

      await resetAndMockDB(db => {
        createAuthorsBookSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
      });

      const { insertAuthorsBooks } = require('../authorsBooks');

      const res = await insertAuthorsBooks(authorsBooksArgs);

      expect(createAuthorsBookSpy).toHaveBeenCalledWith(authorsBooksArgs);
      expect(res).toMatchObject({
        ...authorsBooksArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const createAuthorsBookSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');
      const errorMessage = 'database is down';

      createAuthorsBookSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => insertAuthorsBooks(authorsBooksArgs)).rejects.toEqual(new Error(errorMessage));
    });
  });

  describe('updateAuthorsBooks for books', () => {
    let authorsBooksForBooksArgs;
    beforeEach(() => {
      authorsBooksForBooksArgs = [
        {
          bookId: 1,
          authorId: 1
        },
        {
          bookId: 1,
          authorId: 2
        },
        {
          bookId: 2,
          authorId: 3
        }
      ];
    });
    it('should have been called with args and update authorsBooks for books', async () => {
      let authorsBooksForBooksSpy;
      await resetAndMockDB(db => {
        authorsBooksForBooksSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
      });

      const { updateAuthorsBooksForBooks } = require('../authorsBooks');
      const res = await updateAuthorsBooksForBooks(authorsBooksForBooksArgs);

      expect(authorsBooksForBooksSpy).toHaveBeenCalledWith(authorsBooksForBooksArgs, {
        fields: ['id', 'bookId', 'authorId'],
        updateOnDuplicate: ['bookId']
      });
      expect(res).toMatchObject({
        ...authorsBooksForBooksArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const authorsBooksForBooksSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');

      const errorMessage = 'database is down';

      authorsBooksForBooksSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => updateAuthorsBooksForBooks(authorsBooksForBooksArgs)).rejects.toEqual(new Error(errorMessage));
    });
  });

  describe('updateAuthorsBooks for authors', () => {
    let authorsBooksForAuthorsArgs;
    beforeEach(() => {
      authorsBooksForAuthorsArgs = [
        {
          bookId: 1,
          authorId: 1
        },
        {
          bookId: 2,
          authorId: 1
        },
        {
          bookId: 3,
          authorId: 2
        }
      ];
    });
    it('should have been called with args and update authorsBooks for authors', async () => {
      let authorsBooksForAuthorsSpy;
      await resetAndMockDB(db => {
        authorsBooksForAuthorsSpy = jest.spyOn(db.models.authors_books, 'bulkCreate');
      });

      const { updateAuthorsBooksForAuthors } = require('../authorsBooks');
      const res = await updateAuthorsBooksForAuthors(authorsBooksForAuthorsArgs);

      expect(authorsBooksForAuthorsSpy).toHaveBeenCalledWith(authorsBooksForAuthorsArgs, {
        fields: ['id', 'bookId', 'authorId'],
        updateOnDuplicate: ['authorId']
      });
      expect(res).toMatchObject({
        ...authorsBooksForAuthorsArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const authorsBooksForAuthorsSpy = jest.spyOn(db.authorsBooks, 'bulkCreate');

      const errorMessage = 'database is down';

      authorsBooksForAuthorsSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => updateAuthorsBooksForAuthors(authorsBooksForAuthorsArgs)).rejects.toEqual(
        new Error(errorMessage)
      );
    });
  });
});
