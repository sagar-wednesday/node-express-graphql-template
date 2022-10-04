import db from '@database/models';

export const insertAuthorsBooks = args => db.authorsBooks.bulkCreate(args);

export const updateAuthorsBooksForBooks = args =>
  db.authorsBooks.bulkCreate(args, {
    fields: ['id', 'bookId', 'authorId'],
    updateOnDuplicate: ['bookId']
  });

export const updateAuthorsBooksForAuthors = args =>
  db.authorsBooks.bulkCreate(args, {
    fields: ['id', 'bookId', 'authorId'],
    updateOnDuplicate: ['authorId']
  });
