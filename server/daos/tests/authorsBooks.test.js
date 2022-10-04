import db from '@database/models';
import { insertAuthorsBooks, updateAuthorsBooksForAuthors, updateAuthorsBooksForBooks } from '../authorsBooks';

describe('authorsBooks dao tests', () => {
  it('should create authorsBooks', async () => {
    const authorsBooksArgs = [
      {
        bookId: 1,
        authorId: 1
      },
      {
        bookId: 1,
        authorId: 2
      },
      {
        bookId: 1,
        authorId: 3
      }
    ];

    const mock = jest.spyOn(db.authorsBooks, 'bulkCreate');
    await insertAuthorsBooks(authorsBooksArgs);
    expect(mock).toHaveBeenCalledWith(authorsBooksArgs);
  });

  it('should update authorsBooks for books', async () => {
    const authorsBooksArgs = [
      {
        bookId: 1,
        authorId: 1
      },
      {
        bookId: 1,
        authorId: 2
      },
      {
        bookId: 1,
        authorId: 3
      }
    ];

    const mock = jest.spyOn(db.authorsBooks, 'bulkCreate');
    await updateAuthorsBooksForBooks(authorsBooksArgs);

    expect(mock).toHaveBeenCalledWith(authorsBooksArgs, {
      fields: ['id', 'bookId', 'authorId'],
      updateOnDuplicate: ['bookId']
    });
  });

  it('should update authorsBooks for authors', async () => {
    const authorsBooksArgs = [
      {
        bookId: 1,
        authorId: 1
      },
      {
        bookId: 2,
        authorId: 1
      },
      {
        bookId: 3,
        authorId: 1
      }
    ];

    const mock = jest.spyOn(db.authorsBooks, 'bulkCreate');
    await updateAuthorsBooksForAuthors(authorsBooksArgs);

    expect(mock).toHaveBeenCalledWith(authorsBooksArgs, {
      fields: ['id', 'bookId', 'authorId'],
      updateOnDuplicate: ['authorId']
    });
  });
});
