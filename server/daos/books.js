import db from '@database/models';
import { daosUpdateUtils } from '@server/utils/daosUpdateUtils';

export const insertBook = args => db.books.create(args);

export const updateBook = ({ id, name, genres, pages, publisherId }, { fetchUpdated }) =>
  daosUpdateUtils(db.books, id, { name, genres, pages, publisherId }, fetchUpdated);
