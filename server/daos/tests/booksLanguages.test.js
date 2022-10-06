import db from '@database/models';
import { resetAndMockDB } from '@server/utils/testUtils';
import {
  insertBooksLanguages,
  updateBooksLanguagesForBooks,
  updateBooksLanguagesForLanguages
} from '../booksLanguages';
import { booksLanguagesArgs } from './mockDaoData';

describe('booksLanguages dao tests', () => {
  describe('createBooksLanguages', () => {
    let createArgs;
    beforeEach(() => {
      createArgs = booksLanguagesArgs.create;
    });
    it('should insertBooksLanguages called with args and create booksLanguages', async () => {
      let createBooksLanguageSpy;

      await resetAndMockDB(db => {
        createBooksLanguageSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
      });

      const { insertBooksLanguages } = require('../booksLanguages');

      const res = await insertBooksLanguages(createArgs);

      expect(createBooksLanguageSpy).toHaveBeenCalledWith(createArgs);
      expect(res).toMatchObject({
        ...createArgs
      });
    });

    it('should throw an error if the database is down', async () => {
      const createBooksLanguageSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');
      const errorMessage = 'database is down';

      createBooksLanguageSpy.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      expect(async () => insertBooksLanguages(createArgs)).rejects.toEqual(new Error(errorMessage));
    });
  });

  describe('updateBooksLanguages', () => {
    let updateArgs;
    beforeEach(() => {
      updateArgs = booksLanguagesArgs.update;
    });

    describe('updateBooksLanguages for books', () => {
      it('should have been called with args and update booksLanguages for books', async () => {
        let booksLanguagesForBooksSpy;
        await resetAndMockDB(db => {
          booksLanguagesForBooksSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
        });

        const { updateBooksLanguagesForBooks } = require('../booksLanguages');
        const res = await updateBooksLanguagesForBooks(updateArgs);

        expect(booksLanguagesForBooksSpy).toHaveBeenCalledWith(updateArgs, {
          fields: ['id', 'bookId', 'languageId'],
          updateOnDuplicate: ['bookId']
        });
        expect(res).toMatchObject({
          ...updateArgs
        });
      });

      it('should throw an error if the database is down', async () => {
        const booksLanguagesForBooksSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');

        const errorMessage = 'database is down';

        booksLanguagesForBooksSpy.mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        expect(async () => updateBooksLanguagesForBooks(updateArgs)).rejects.toEqual(new Error(errorMessage));
      });
    });

    describe('updateBooksLanguages for languages', () => {
      let booksLanguagesForLanguagesSpy;

      it('should have been called with args and update booksLanguages for languages', async () => {
        await resetAndMockDB(db => {
          booksLanguagesForLanguagesSpy = jest.spyOn(db.models.books_languages, 'bulkCreate');
        });

        const { updateBooksLanguagesForLanguages } = require('../booksLanguages');
        const res = await updateBooksLanguagesForLanguages(updateArgs);

        expect(booksLanguagesForLanguagesSpy).toHaveBeenCalledWith(updateArgs, {
          fields: ['id', 'bookId', 'languageId'],
          updateOnDuplicate: ['languageId']
        });
        expect(res).toMatchObject({
          ...updateArgs
        });
      });

      it('should throw an error if the database is down', async () => {
        booksLanguagesForLanguagesSpy = jest.spyOn(db.booksLanguages, 'bulkCreate');
        const errorMessage = 'database is down';

        booksLanguagesForLanguagesSpy.mockImplementationOnce(() => {
          throw new Error(errorMessage);
        });

        expect(async () => updateBooksLanguagesForLanguages(updateArgs)).rejects.toEqual(new Error(errorMessage));
      });
    });
  });
});
