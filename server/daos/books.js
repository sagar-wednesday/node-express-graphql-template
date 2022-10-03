import db from '@database/models';

export const insertBook = args => db.books.create(args);

export const updateBook = async ({ id, name, genres, pages, publisherId }) => {
  const bookRes = await db.books.update({ name, genres, pages, publisherId }, { where: { id }, returning: true });

  return bookRes[1][0];
};
