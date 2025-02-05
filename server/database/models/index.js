import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import { getClient } from '../index';

export const db = {};

dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });

const sequelize = getClient();

db.books = require('@database/models/books').model(sequelize, Sequelize.DataTypes);
db.authors = require('@database/models/authors').model(sequelize, Sequelize.DataTypes);
db.authorsBooks = require('@database/models/authors_books').model(sequelize, Sequelize.DataTypes);
db.publishers = require('@database/models/publishers').model(sequelize, Sequelize.DataTypes);
db.languages = require('@database/models/languages').model(sequelize, Sequelize.DataTypes);
db.booksLanguages = require('@database/models/books_languages').model(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

export default db;
