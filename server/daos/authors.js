import db from '@database/models';

export const insertAuthor = args => db.books.create(args);

export const updateAuthor = async ({ id, name, country, age }) => {
  const authorRes = await db.authors.update({ name, country, age }, { where: { id }, returning: true });

  return authorRes[1][0];
};
