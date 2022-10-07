import { invalidScope } from '@middleware/gqlAuth';

describe('gqlAuth tests', () => {
  let res;
  beforeEach(() => {
    res = {
      status: code => ({
        status: code,
        send: msg => msg
      })
    };
  });
  it('should set the status to 401 when invalidScope is called ', () => {
    const spy = jest.spyOn(res, 'status');
    const response = invalidScope(res);
    expect(spy).toBeCalledWith(401);
    expect(response.errors[0]).toBe(
      'Invalid scope to perform this operation. Contact support@wednesday.is for more information.'
    );
  });
  describe('handlePreflight middleware', () => {
    it('should be able to return status 200 when call OPTIONS request', async () => {
      const { handlePreflightRequest } = require('../index');
      const req = {
        method: 'OPTIONS'
      };
      const res = {
        header: jest.fn(() => {}),
        sendStatus: jest.fn(() => {})
      };
      await handlePreflightRequest(req, res, () => {});
      expect(res.header.mock.calls.length).toBe(1);
      expect(res.sendStatus.mock.calls.length).toBe(1);
    });

    it('should be able to call next handler if valid request', async () => {
      const { handlePreflightRequest } = require('../index');
      const req = {
        method: 'GET'
      };
      const res = {
        header: () => {},
        sendStatus: () => {}
      };
      const next = jest.fn(() => {});
      await handlePreflightRequest(req, res, next);
      expect(next.mock.calls.length).toBe(1);
    });
  });

  describe('corsOptionsDelegate options', () => {
    beforeEach(() => {
      process.env.ENVIRONMENT_NAME = 'dev';
      process.env.NODE_ENV = 'dev';
    });
    it('should be able to return origin:true when local or test env', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        method: 'GET'
      };
      process.env.ENVIRONMENT_NAME = 'local';
      process.env.NODE_ENV = 'local';
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:true when domain matches the req headers', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        header: () => 'owner.wednesday.is',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:true when domain requesting from localhost', async () => {
      const { corsOptionsDelegate } = require('../index');
      const req = {
        header: () => 'localhost:3000',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: true });
    });

    it('should be able to return origin:false when req headers is not any of allowed domain!', async () => {
      const { corsOptionsDelegate } = require('../index');

      const req = {
        header: () => 'www.ws.is',
        method: 'GET'
      };
      const callback = jest.fn(() => {});
      await corsOptionsDelegate(req, callback);
      expect(callback.mock.calls.length).toBe(1);
      expect(callback.mock.calls[0][1]).toEqual({ origin: false });
    });
  });
  describe('getQuery middleware Tests', () => {
    const storeQuery = `stores(limit: 2) {
                      edges {
                        node {
                          id
                        }
                      }
                    }`;
    const supplierQuery = `suppliers(limit: 2) {
                      edges {
                        node {
                          id
                          name
                        }
                      }
                    }`;
    const request = {
      body: { query: `query { ${storeQuery} }` }
    };
    it('successfully get queryName', async () => {
      const { getQueryNames } = require('../index');
      const response = await getQueryNames(request);
      expect(response).toBeTruthy();
      expect(response[0].queryName).toEqual('stores');
    });
    it('successfully gets queryNames when operationName is provided', async () => {
      request.body.query = ` query Stores { ${storeQuery} } query Suppliers { ${supplierQuery} } `;
      request.body.operationName = 'Stores';
      const { getQueryNames } = require('../index');
      const response = await getQueryNames(request);
      expect(response.length).toEqual(1);
      expect(response[0]).toEqual({ operationType: 'query', queryName: 'stores' });
    });

    it('successfully gets queryNames when operationName is provided and there are multiple queries inside one operation', async () => {
      request.body.query = `query StoresAndSuppliers { ${storeQuery} ${supplierQuery} }`;
      request.body.operationName = 'StoresAndSuppliers';
      const { getQueryNames } = require('../index');
      const response = await getQueryNames(request);
      expect(response.length).toEqual(2);
      expect(response[0]).toEqual({ operationType: 'query', queryName: 'stores' });
      expect(response[1]).toEqual({ operationType: 'query', queryName: 'suppliers' });
    });

    it('successfully gets queryNames when operationName is not provided and there are multiple queries inside one operation', async () => {
      request.body.query = `query { ${storeQuery} ${supplierQuery} }`;
      const { getQueryNames } = require('../index');
      const response = await getQueryNames(request);
      expect(response.length).toEqual(2);
      expect(response[0]).toEqual({ operationType: 'query', queryName: 'stores' });
      expect(response[1]).toEqual({ operationType: 'query', queryName: 'suppliers' });
    });
  });
  describe('isPublicQuery tests', () => {
    it('should be able to find out if a query is public or not', async () => {
      const { isPublicQuery } = require('../index');
      const req = {
        body: {
          query: `query author{
            author(id:1){
              id
            }
          }
          `
        }
      };
      const response = await isPublicQuery(req);
      expect(response).toBe(false);
    });
  });
});
