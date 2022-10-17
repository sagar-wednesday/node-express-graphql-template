import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { publishersTable } from '@utils/testUtils/mockData';

describe('Publisher graphQL-server-DB mutation tests', () => {
  const createPublisherMutation = `
    mutation {
      createPublisher (
          name: "${publishersTable[0].name}",
          country: "${publishersTable[0].country}"
        ) {
          id
          name
          country
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

  const updatePublisherMutation = `
    mutation {
        updatePublisher (
            id: 1,
            name: "MIT",
            country: "India"
        ) {
            id
        }
    }
  `;

  const deleteLanguageMutation = `mutation DeleteLanguage {
    deleteLanguage(id: ${publishersTable[0].id}) {
      id
    }
  }`;

  it('should have a mutation to create a new publisher', async () => {
    const response = await getResponse(createPublisherMutation);
    const result = get(response, 'body.data.createPublisher');

    expect(result).toMatchObject({
      id: publishersTable[0].id,
      name: publishersTable[0].name,
      country: publishersTable[0].country
    });
  });

  describe('update mutation', () => {
    it('should have a mutation to update an publisher', async () => {
      const response = await getResponse(updatePublisherMutation);
      const result = get(response, 'body.data.updatePublisher');

      expect(result).toMatchObject({
        id: '1'
      });
    });

    it('should throw the error if the database is down', async () => {
      const dbClient = mockDBClient();
      resetAndMockDB(null, {}, dbClient);
      const errorMessage = 'Failed to update publishers';
      jest.spyOn(dbClient.models.publishers, 'update').mockImplementation(() => {
        throw new Error(errorMessage);
      });
      const response = await getResponse(updatePublisherMutation);
      const result = get(response, 'body.errors[0]');

      expect(result).toEqual(errorMessage);
    });
  });

  it('should have a mutation to delete an publisher', async () => {
    const response = await getResponse(deleteLanguageMutation);
    const result = get(response, 'body.data.deleteLanguage');

    expect(result).toEqual(
      expect.objectContaining({
        id: 1
      })
    );
  });
});
