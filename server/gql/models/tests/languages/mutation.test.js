import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { languagesTable } from '@utils/testUtils/mockData';

describe('Address graphQL-server-DB mutation tests', () => {
  const createLanguageMutation = `
    mutation {
      createLanguage (
          language: "${languagesTable[0].language}"
        ) {
          id
          language
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

  const updateLanguageMutationWithBooks = `
    mutation {
        updateLanguage (
            id: 1,
            language: "Shaktiman",
            booksId: [{bookId: 2}]
        ) {
            id
        }
    }
  `;

  const updateLanguageMutation = `
    mutation {
        updateLanguage (
            id: 1,
            language: "Shaktiman"
        ) {
            id
        }
    }
  `;

  const deleteLanguageMutation = `mutation DeleteLanguage {
    deleteLanguage(id: ${languagesTable[0].id}) {
      id
    }
  }`;

  it('should have a mutation to create a new language', async () => {
    const response = await getResponse(createLanguageMutation);
    const result = get(response, 'body.data.createLanguage');

    expect(result).toMatchObject({
      id: languagesTable[0].id,
      language: languagesTable[0].language
    });
  });

  describe('update mutation', () => {
    it('should have a mutation to update an language with booksId as input', async () => {
      const response = await getResponse(updateLanguageMutationWithBooks);
      const result = get(response, 'body.data.updateLanguage');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should have a mutation to update an language without booksId', async () => {
      const response = await getResponse(updateLanguageMutation);
      const result = get(response, 'body.data.updateLanguage');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should throw the error if the database is down', async () => {
      const dbClient = mockDBClient();
      resetAndMockDB(null, {}, dbClient);
      const errorMessage = 'Unexpected error value: undefined';
      jest.spyOn(dbClient.models.languages, 'update').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const response = await getResponse(updateLanguageMutation);
      const result = get(response, 'body.errors[0]');

      expect(result).toEqual(errorMessage);
    });
  });

  it('should have a mutation to delete an language', async () => {
    const response = await getResponse(deleteLanguageMutation);
    const result = get(response, 'body.data.deleteLanguage');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
