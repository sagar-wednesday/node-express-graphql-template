import get from 'lodash/get';
import { getResponse, mockDBClient, resetAndMockDB } from '@utils/testUtils';
import { authorsTable, languagesTable, publishersTable, booksTable } from '@utils/testUtils/mockData';

describe('Language graphQL-server-DB query tests', () => {
  const bookId = parseInt(booksTable[0].id);
  const publisher = publishersTable[0].name;
  const language = languagesTable[0].language;
  const genre = booksTable[0].genres;

  const bookOneFromId = `
    query {
        book (id: ${bookId}) {
            id
            name
            genres
            pages
            authors {
              edges {
                node {
                  id 
                  name
                  age
                  country
                }
              }
            }
            languages {
              edges {
                node {
                  id
                  language 
                }
              }
            }
            publishers {
              edges {
                  node {
                      id 
                      name
                      country
                  }
              }
            }
        }
    }
  `;

  const bookOneFromPublishers = `
    query {
        books (publishers: "${publisher}") {
          edges {
            node {
              id
              name
              genres
              pages
              publishers {
                edges {
                    node {
                      id 
                      name
                      country
                    }
                }
              }
            }
          }     
        }
    }
  `;

  const bookOneFromLanguages = `
    query {
        books (languages: "${language}") {
          edges {
            node {
              id
              name
              genres
              pages
              languages {
                edges {
                    node {
                      id 
                      language
                    }
                }
              }
            }
          }     
        }
    }
  `;

  const bookOneFromGenres = `
    query {
        books (genres: "${genre}") {
          edges {
            node {
              id
              name
              genres
              pages
            }
          }     
        }
    }
  `;

  it('should return all the fields of the book to validate the returning values has the right values that are associated with the given bookId', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.authors, 'findAll').mockImplementation(() => [authorsTable[0]]);
    jest.spyOn(dbClient.models.languages, 'findAll').mockImplementation(() => [languagesTable[0]]);
    jest.spyOn(dbClient.models.publishers, 'findAll').mockImplementation(() => [publishersTable[0]]);

    await getResponse(bookOneFromId).then(response => {
      console.log('response body', response.body);
      expect(get(response, 'body.data.book')).toMatchObject({
        id: booksTable[0].id,
        name: booksTable[0].name,
        genres: booksTable[0].genres,
        pages: `${booksTable[0].pages}`,
        authors: {
          edges: [
            {
              node: {
                id: authorsTable[0].id,
                name: authorsTable[0].name,
                age: authorsTable[0].age,
                country: authorsTable[0].country
              }
            }
          ]
        },
        languages: {
          edges: [
            {
              node: {
                id: languagesTable[0].id,
                language: languagesTable[0].language
              }
            }
          ]
        },
        publishers: {
          edges: [
            {
              node: {
                id: publishersTable[0].id,
                name: publishersTable[0].name,
                country: publishersTable[0].country
              }
            }
          ]
        }
      });
    });
  });

  it('should request for authors related to the book', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.authors, 'findAll').mockImplementation(() => [authorsTable[0]]);

    await getResponse(bookOneFromId).then(response => {
      expect(get(response, 'body.data.book')).toBeTruthy();

      console.log('bookOne', get(response, 'body.data.book'));
      // check if authors.findAll is being called once
      expect(dbClient.models.authors.findAll.mock.calls.length).toBe(1);
      // check if authors.findAll is being called with the correct whereclause
      expect(dbClient.models.authors.findAll.mock.calls[0][0].include[0].where).toEqual({ bookId });
      // check if the included model has name: authors_books
      expect(dbClient.models.authors.findAll.mock.calls[0][0].include[0].model.name).toEqual('authors_books');
    });
  });

  it('should request for languages related to the book', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.languages, 'findAll').mockImplementation(() => [languagesTable[0]]);

    await getResponse(bookOneFromId).then(response => {
      expect(get(response, 'body.data.book')).toBeTruthy();
      // check if languages.findAll is being called once
      expect(dbClient.models.languages.findAll.mock.calls.length).toBe(1);
      // check if languages.findAll is being called with the correct whereclause
      expect(dbClient.models.languages.findAll.mock.calls[0][0].include[0].where).toEqual({ bookId });
      // check if the included model has name: books_languages
      expect(dbClient.models.languages.findAll.mock.calls[0][0].include[0].model.name).toEqual('books_languages');
    });
  });

  it('should request for publishers related to the book', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);

    jest.spyOn(dbClient.models.publishers, 'findAll').mockImplementation(() => [publishersTable[0]]);

    await getResponse(bookOneFromId).then(response => {
      expect(get(response, 'body.data.book')).toBeTruthy();
      // check if publishers.findAll is being called once
      expect(dbClient.models.publishers.findAll.mock.calls.length).toBe(1);
      // check if publishers.findAll is being called with the correct whereclause
      expect(dbClient.models.publishers.findAll.mock.calls[0][0].include[0].where).toEqual({ id: bookId });
      // check if the included model has name: books
      expect(dbClient.models.publishers.findAll.mock.calls[0][0].include[0].model.name).toEqual('books');
    });
  });

  it('should request for books with the provided publishers', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.publishers, 'findAll').mockImplementation(() => [publishersTable[0]]);

    await getResponse(bookOneFromPublishers).then(response => {
      expect(get(response, 'body.data.books.edges[0]')).toMatchObject({
        node: {
          id: booksTable[0].id,
          name: booksTable[0].name,
          genres: booksTable[0].genres,
          pages: `${booksTable[0].pages}`,
          publishers: {
            edges: [
              {
                node: {
                  id: publishersTable[0].id,
                  name: publishersTable[0].name,
                  country: publishersTable[0].country
                }
              }
            ]
          }
        }
      });
    });
  });

  it('should request for books with the provided languages', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.languages, 'findAll').mockImplementation(() => [languagesTable[0]]);

    await getResponse(bookOneFromLanguages).then(response => {
      expect(get(response, 'body.data.books.edges[0]')).toMatchObject({
        node: {
          id: booksTable[0].id,
          name: booksTable[0].name,
          genres: booksTable[0].genres,
          pages: `${booksTable[0].pages}`,
          languages: {
            edges: [
              {
                node: {
                  id: languagesTable[0].id,
                  language: languagesTable[0].language
                }
              }
            ]
          }
        }
      });
    });
  });

  it('should request for books with the provided genres', async () => {
    const dbClient = mockDBClient();
    resetAndMockDB(null, {}, dbClient);
    jest.spyOn(dbClient.models.books, 'findAll').mockImplementation(() => [booksTable[0]]);

    await getResponse(bookOneFromGenres).then(response => {
      expect(get(response, 'body.data.books.edges[0]')).toMatchObject({
        node: {
          id: booksTable[0].id,
          name: booksTable[0].name,
          genres: booksTable[0].genres,
          pages: `${booksTable[0].pages}`
        }
      });
    });
  });
});
