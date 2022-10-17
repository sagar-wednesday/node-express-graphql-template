describe('redis', () => {
  it('should set the REDIS_PORT and REDIS_DOMAIN', async () => {
    process.env.REDIS_PORT = 6379;
    process.env.REDIS_DOMAIN = 'redis';
    const { redis } = await require('../redis');
    expect(redis.publish()).toEqual({});
  });
});
