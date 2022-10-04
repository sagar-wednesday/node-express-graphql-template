import { redis } from '@server/services/redis';
import * as utils from '@server/utils';
import { REDIS_IMPLEMENTATION_DATE } from '@server/utils/constants';
import { aggregateCheck } from '../aggregateJob';

describe('Aggregate job tests', () => {
  it('should log that everything is up to date if lastSyncFor is equal to end date', async () => {
    jest.spyOn(redis, 'get').mockReturnValueOnce(REDIS_IMPLEMENTATION_DATE);
    const spy = jest.spyOn(utils, 'logger');
    await aggregateCheck();
    expect(spy).toBeCalledTimes(1);
  });
});
