import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
import { authorsTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
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

  const updateAuthorMutation = `
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

  it('should have a mutation to update a new author', async () => {
    const response = await getResponse(updateAuthorMutation);
    const result = get(response, 'body.data.updateAuthor');

    expect(result).toMatchObject({
      id: '1'
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
