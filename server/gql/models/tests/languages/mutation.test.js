import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';
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

  const updateLanguageMutation = `
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

  const deleteLanguageMutation = `mutation DeleteLanguage {
    deleteLanguage(id: ${languagesTable[0].id}) {
      id
    }
  }`;

  it('should have a mutation to create a new author', async () => {
    const response = await getResponse(createLanguageMutation);
    const result = get(response, 'body.data.createLanguage');

    expect(result).toMatchObject({
      id: languagesTable[0].id,
      language: languagesTable[0].language
    });
  });

  it('should have a mutation to update a new author', async () => {
    const response = await getResponse(updateLanguageMutation);
    const result = get(response, 'body.data.updateLanguage');

    expect(result).toMatchObject({
      id: '1'
    });
  });

  it('should have a mutation to delete an author', async () => {
    const response = await getResponse(deleteLanguageMutation);
    const result = get(response, 'body.data.deleteLanguage');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
