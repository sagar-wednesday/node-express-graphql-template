import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { booksTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  const createBookMutation = `
    mutation {
      createBook (
          name: "${booksTable[0].name}",
          genres: "${booksTable[0].genres}",
          pages: "${booksTable[0].pages}",
          publisherId: "1",
          authorsId: [{authorId: 1}],
          languagesId: [{languageId: 1}]
        ) {
          id
          name
          genres
          pages
          createdAt
          updatedAt
          deletedAt
          authors {
              edges {
                  node {
                      id
                  }
              }
          }
        }
    }
`;

  const updateBookMutationWithAuthorAndLanguages = `
    mutation {
        updateBook (
          id: 1,
          name: "Glitter in Sky",
          genres: "Fantasy",
          pages: "201",
          publisherId: "2",
          authorsId: [{authorId: 2}],
          languagesId: [{languageId: 2}]
        ) {
            id
        }
    }
  `;

  const updateBookMutation = `
    mutation {
        updateBook (
          id: 1,
          name: "Glitter in Sky",
          genres: "Fantasy",
          pages: "201",
          publisherId: "2"
        ) {
            id
        }
    }
  `;

  const deleteBookMutation = `mutation DeleteLanguage {
    deleteBook(id: ${booksTable[0].id}) {
      id
    }
  }`;

  describe('create mutation', () => {
    it('should have a mutation to create a new book', async () => {
      const response = await getResponse(createBookMutation);
      const result = get(response, 'body.data.createBook');
      expect(result).toMatchObject({
        id: booksTable[0].id,
        name: booksTable[0].name,
        genres: booksTable[0].genres,
        pages: `${booksTable[0].pages}`
      });
    });

    it('should throw the error if the database is down', async () => {
      const errorMessage = 'Unexpected error value: undefined';

      const dbClient = mockDBClient();
      resetAndMockDB(null, {}, dbClient);
      jest.spyOn(dbClient.models.books, 'create').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const response = await getResponse(createBookMutation);
      const result = get(response, 'body.errors[0]');

      expect(result).toEqual(errorMessage);
    });
  });

  describe('update mutation', () => {
    it('should have a mutation to update an author with authorsId and languagesId as input', async () => {
      const response = await getResponse(updateBookMutationWithAuthorAndLanguages);
      const result = get(response, 'body.data.updateBook');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should have a mutation to update an author without authorsId and languagesId as input', async () => {
      const response = await getResponse(updateBookMutation);
      const result = get(response, 'body.data.updateBook');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should throw the error if the database is down', async () => {
      const errorMessage = 'Unexpected error value: undefined';

      const dbClient = mockDBClient();
      resetAndMockDB(null, {}, dbClient);
      jest.spyOn(dbClient.models.books, 'update').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const response = await getResponse(updateBookMutation);
      const result = get(response, 'body.errors[0]');

      expect(result).toEqual(errorMessage);
    });
  });

  it('should have a mutation to delete an author', async () => {
    const response = await getResponse(deleteBookMutation);
    const result = get(response, 'body.data.deleteBook');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
