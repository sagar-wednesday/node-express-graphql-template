import db from '@database/models';

export const insertAuthor = args => db.authors.create(args);

export const updateAuthor = async ({ id, name, country, age }) => {
  const res = await db.authors.update({ name, country, age }, { where: { id }, returning: true });

  return res[1][0];
};
