import db from '@database/models';
import { resetAndMockDB } from '@server/utils/testUtils';
import {
  insertBooksLanguages,
  updateBooksLanguagesForBooks,
  updateBooksLanguagesForLanguages
} from '../booksLanguages';

describe('booksLanguages dao tests', () => {
  describe('createBooksLanguages', () => {
    let booksLanguagesArgs;
    beforeEach(() => {
      booksLanguagesArgs = [
        {
          bookId: 1,
          languageId: 1
        },
        {
          bookId: 1,
          languageId: 2
        },
        {
          bookId: 1,
          languageId: 3
        }
      ];
    });
    it('should insertBooksLanguages called with args and create booksLanguages', async () => {
      let createBooksLanguageSpy;

      await resetAndMockDB(db => {
        createBooksLanguageSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
      });

      const { insertBooksLanguages } = require('../booksLanguages');

      const res = await insertBooksLanguages(booksLanguagesArgs);

      expect(createBooksLanguageSpy).toHaveBeenCalledWith(booksLanguagesArgs);
      expect(res).toMatchObject({
        ...booksLanguagesArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const createBooksLanguageSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');
      const errorMessage = 'database is down';

      createBooksLanguageSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => insertBooksLanguages(booksLanguagesArgs)).rejects.toEqual(new Error(errorMessage));
    });
  });

  describe('updateBooksLanguages for books', () => {
    let booksLanguagesForBooksArgs;
    beforeEach(() => {
      booksLanguagesForBooksArgs = [
        {
          bookId: 1,
          languageId: 1
        },
        {
          bookId: 1,
          languageId: 2
        },
        {
          bookId: 2,
          languageId: 3
        }
      ];
    });
    it('should have been called with args and update booksLanguages for books', async () => {
      let booksLanguagesForBooksSpy;
      await resetAndMockDB(db => {
        booksLanguagesForBooksSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
      });

      const { updateBooksLanguagesForBooks } = require('../booksLanguages');
      const res = await updateBooksLanguagesForBooks(booksLanguagesForBooksArgs);

      expect(booksLanguagesForBooksSpy).toHaveBeenCalledWith(booksLanguagesForBooksArgs, {
        fields: ['id', 'bookId', 'languageId'],
        updateOnDuplicate: ['bookId']
      });
      expect(res).toMatchObject({
        ...booksLanguagesForBooksArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const booksLanguagesForBooksSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');

      const errorMessage = 'database is down';

      booksLanguagesForBooksSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => updateBooksLanguagesForBooks(booksLanguagesForBooksArgs)).rejects.toEqual(
        new Error(errorMessage)
      );
    });
  });

  describe('updateBooksLanguages for languages', () => {
    let booksLanguagesForLanguagesArgs;
    beforeEach(() => {
      booksLanguagesForLanguagesArgs = [
        {
          bookId: 1,
          languageId: 1
        },
        {
          bookId: 2,
          languageId: 1
        },
        {
          bookId: 3,
          languageId: 2
        }
      ];
    });
    it('should have been called with args and update booksLanguages for languages', async () => {
      let booksLanguagesForLanguagesSpy;
      await resetAndMockDB(db => {
        booksLanguagesForLanguagesSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
      });

      const { updateBooksLanguagesForLanguages } = require('../booksLanguages');
      const res = await updateBooksLanguagesForLanguages(booksLanguagesForLanguagesArgs);

      expect(booksLanguagesForLanguagesSpy).toHaveBeenCalledWith(booksLanguagesForLanguagesArgs, {
        fields: ['id', 'bookId', 'languageId'],
        updateOnDuplicate: ['languageId']
      });
      expect(res).toMatchObject({
        ...booksLanguagesForLanguagesArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const booksLanguagesForLanguagesSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');
      const errorMessage = 'database is down';

      booksLanguagesForLanguagesSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => updateBooksLanguagesForLanguages(booksLanguagesForLanguagesArgs)).rejects.toEqual(
        new Error(errorMessage)
      );
    });
  });
});
