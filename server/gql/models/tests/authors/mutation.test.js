import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { authorsTable } from '@utils/testUtils/mockData';

describe('Author graphQL-server-DB mutation tests', () => {
  const createAuthorMutation = `
    mutation {
      createAuthor (
          name: "${authorsTable[0].name}",
          country: "${authorsTable[0].country}",
          age: ${authorsTable[0].age},
          booksId: [{bookId: 1}]
        ) {
          id
          name
          country
          age
          createdAt
          updatedAt
          deletedAt
          books {
              edges {
                  node {
                      id
                  }
              }
          }
        }
    }
`;

  const updateAuthorMutationWithBooks = `
    mutation {
        updateAuthor (
            id: 1,
            name: "Shaktiman",
            country: "India",
            age: 22,
            booksId: [{bookId: 2}]
        ) {
            id
        }
    }
  `;

  const updateAuthorMutation = `
    mutation {
        updateAuthor (
            id: 1,
            name: "Shaktiman",
            country: "India",
            age: 22,
        ) {
            id
        }
    }
  `;

  const deleteAuthorMutation = `mutation DeleteAuthor {
    deleteAuthor(id: ${authorsTable[0].id}) {
      id
    }
  }`;

  it('should have a mutation to create a new author', async () => {
    const response = await getResponse(createAuthorMutation);
    const result = get(response, 'body.data.createAuthor');

    expect(result).toMatchObject({
      id: authorsTable[0].id,
      name: authorsTable[0].name,
      country: authorsTable[0].country,
      age: authorsTable[0].age
    });
  });

  describe('update mutation', () => {
    it('should have a mutation to update an author with booksId as input', async () => {
      const response = await getResponse(updateAuthorMutationWithBooks);
      const result = get(response, 'body.data.updateAuthor');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should have a mutation to update an author without booksId', async () => {
      const response = await getResponse(updateAuthorMutation);
      const result = get(response, 'body.data.updateAuthor');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should throw the error if the database is down', async () => {
      const dbClient = mockDBClient();
      resetAndMockDB(null, {}, dbClient);
      const errorMessage = 'Unexpected error value: undefined';
      jest.spyOn(dbClient.models.authors, 'update').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const response = await getResponse(updateAuthorMutation);
      const result = get(response, 'body.errors[0]');

      expect(result).toEqual(errorMessage);
    });
  });

  it('should have a mutation to delete an author', async () => {
    const response = await getResponse(deleteAuthorMutation);
    const result = get(response, 'body.data.deleteAuthor');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
