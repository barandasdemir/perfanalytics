const supertest = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should respond with message', async () => {
    const response = await supertest(app).get('/').expect(200);
    expect(response.body.message).toBe('PerfAnalytics - 👋🌎🌍🌏');
  });
});

describe('GET /someRandomEndpoint', () => {
  it('should return 404 not found error', async () => {
    await supertest(app).get('/someRandomEndpoint').expect(404);
  });
});
