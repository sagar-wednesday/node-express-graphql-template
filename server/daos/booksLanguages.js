import db from '@database/models';

export const insertBooksLanguages = args => db.booksLanguages.bulkCreate(args);

export const updateBooksLanguagesForBooks = args =>
  db.booksLanguages.bulkCreate(args, {
    fields: ['id', 'bookId', 'languageId'],
    updateOnDuplicate: ['bookId']
  });

export const updateBooksLanguagesForLanguages = args =>
  db.booksLanguages.bulkCreate(args, {
    fields: ['id', 'bookId', 'languageId'],
    updateOnDuplicate: ['languageId']
  });
