export function getAttributes(sequelize, DataTypes) {
  return {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    genres: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publishedBy: {
      field: 'published_by',
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      allowNull: true
    },
    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
      allowNull: true
    }
  };
}

export function model(sequelize, DataTypes) {
  const books = sequelize.define('books', getAttributes(sequelize, DataTypes), {
    tableName: 'books',
    paranoid: true,
    timeStamps: true
  });

  books.associate = function(models) {
    books.authors = books.belongsToMany(models.authors, {
      through: models.authorsBooks,
      sourceKey: 'id',
      otherKey: 'author_id'
    });

    books.authorsBooks = books.hasOne(models.authorsBooks, {
      sourceKey: 'id',
      foreignKey: 'book_id'
    });
  };

  return books;
}
