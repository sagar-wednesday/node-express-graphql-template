import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { authorsTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  let dbClient;
  const bookId = { bookId: 1 };
  beforeEach(() => {
    dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
  });
  const createAuthorMutation = `
    mutation {
        createAuthor (
          name: "${authorsTable[0].name}",
          country: "${authorsTable[0].country}",
          age: "${authorsTable[0].age}",
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

  const updateAuthorMutation = `
    mutation {
        updateAuthor (
            id: ${authorsTable[0].id},
            name: "${authorsTable[0].name}",
            country: "${authorsTable[0].country}",
            age: "${authorsTable[0].age}"
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

  // it('should have a mutation to create a new author', async () => {
  //   jest.spyOn(dbClient.models.authors, 'create');
  //   const response = await getResponse(createAuthorMutation);
  //   console.log('createResponse', response);
  //   const result = get(response, 'body.data.createAuthor');
  //   console.log('result', result);
  //   expect(result).toBeTruthy();
  //   const { id, ...author } = authorsTable[0];
  //   expect(dbClient.models.authors.create.mock.calls.length).toBe(1);
  //   expect(dbClient.models.authors.create.mock.calls[0][0]).toEqual({
  //     ...author
  //   });
  // });

  it('should have a mutation to delete an author', async () => {
    jest.spyOn(dbClient.models.authors, 'destroy');
    const response = await getResponse(deleteAuthorMutation);
    const result = get(response, 'body.data.deleteAuthor');
    console.log('result of delete', result);
    expect(result).toBeTruthy();
    expect(dbClient.models.authors.destroy.mock.calls.length).toBe(1);
    expect(dbClient.models.authors.destroy.mock.calls[0][0]).toEqual({
      where: {
        deletedAt: null,
        id: parseInt(authorsTable[0].id)
      }
    });
  });
});
