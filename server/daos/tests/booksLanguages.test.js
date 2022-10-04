import db from '@database/models';
import {
  insertBooksLanguages,
  updateBooksLanguagesForBooks,
  updateBooksLanguagesForLanguages
} from '../booksLanguages';

describe('booksLanguages dao tests', () => {
  it('should create booksLanguages', async () => {
    const booksLanguagesArgs = [
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

    const mock = jest.spyOn(db.booksLanguages, 'bulkCreate');
    await insertBooksLanguages(booksLanguagesArgs);
    expect(mock).toHaveBeenCalledWith(booksLanguagesArgs);
  });

  it('should update authorsBooks for books', async () => {
    const booksLanguagesArgs = [
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

    const mock = jest.spyOn(db.booksLanguages, 'bulkCreate');
    await updateBooksLanguagesForBooks(booksLanguagesArgs);

    expect(mock).toHaveBeenCalledWith(booksLanguagesArgs, {
      fields: ['id', 'bookId', 'languageId'],
      updateOnDuplicate: ['bookId']
    });
  });

  it('should update authorsBooks for authors', async () => {
    const booksLanguagesArgs = [
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
        languageId: 1
      }
    ];

    const mock = jest.spyOn(db.booksLanguages, 'bulkCreate');
    await updateBooksLanguagesForLanguages(booksLanguagesArgs);

    expect(mock).toHaveBeenCalledWith(booksLanguagesArgs, {
      fields: ['id', 'bookId', 'languageId'],
      updateOnDuplicate: ['languageId']
    });
  });
});
