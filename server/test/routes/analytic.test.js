const supertest = require('supertest');
const { randomBytes } = require('crypto');
const app = require('../../src/app');

let siteID = null;
const mockMetricData = {
  ttfb: 1,
  fcp: 2,
  domLoad: 3,
  windowLoad: 4,
  resources: [
    {
      name: 'test/file.css',
      duration: 1234,
      size: 123,
    },
  ],
};

describe('GET /api/analytic', () => {
  it('should respond with an empty array', async () => {
    const response = await supertest(app).get('/api/analytic').expect(200);
    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toBeInstanceOf(Array);
  });
});

describe('GET /api/analytic/siteID', () => {
  it("should get website's analytics data", async () => {
    const createdSite = await supertest(app)
      .post('/api/website/register')
      .send({ origin: 'https://example.org' })
      .expect(200);
    expect(createdSite.body).toHaveProperty('data');
    const { id } = createdSite.body.data;
    siteID = id;

    const response = await supertest(app).get(`/api/analytic/${siteID}`).expect(200);
    expect(response.body).toHaveProperty('data');
    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics).toHaveLength(0);
  });
});

describe('GET /api/analytic/someNonExistingValidID', () => {
  it('should respond with a 404 not found error', async () => {
    const randomID = randomBytes(12).toString('hex');
    const response = await supertest(app).get(`/api/analytic/${randomID}`).expect(404);
    const { success, error } = response.body;
    expect(success).toBe(false);
    expect(error).toHaveProperty('type');
    expect(error.type).toBe('Validation');
    expect(error).toHaveProperty('message');
    expect(error.message).toEqual(expect.stringContaining('not find'));
  });
});

describe('GET /api/analytic/someInvalidID', () => {
  it('should give a 400 bad request error', async () => {
    const response = await supertest(app).get('/api/analytic/someInvalidID').expect(400);
    expect(response.body).not.toHaveProperty('data');

    const { success, error } = response.body;
    expect(success).toBe(false);
    expect(error).toHaveProperty('type');
    expect(error.type).toBe('Validation');
    expect(error).toHaveProperty('message');
    expect(error.message).toEqual(expect.stringContaining('invalid'));
  });
});

describe('POST /api/analytic', () => {
  it("should insert analytic data and increment website's metricCount", async () => {
    const mockBeacon = JSON.stringify({ ...mockMetricData, siteID });
    const response = await supertest(app)
      .post(`/api/analytic/${siteID}`)
      .send(mockBeacon)
      .set({
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      .expect(200);
    expect(response.body).toHaveProperty('data');

    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics.length).toBeGreaterThan(0);
  });
});

describe('GET /api/analytic/siteID with start and/or end dates', () => {
  it('should return one metric for last half-hour', async () => {
    const response = await supertest(app).get(`/api/analytic/${siteID}`).expect(200);
    expect(response.body).toHaveProperty('data');

    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics).toHaveLength(1);
  });

  it('should return one metric for starting from an hour ago', async () => {
    const response = await supertest(app)
      .get(`/api/analytic/${siteID}?start=${Date.now() - 60 * 60 * 1000}`)
      .expect(200);
    expect(response.body).toHaveProperty('data');

    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics).toHaveLength(1);
  });

  it('should return empty array for given empty timespan', async () => {
    const response = await supertest(app)
      .get(
        `/api/analytic/${siteID}?start=${Date.now() - 60 * 60 * 1000}&end=${
          Date.now() - 40 * 60 * 1000
        }`,
      )
      .expect(200);
    expect(response.body).toHaveProperty('data');

    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics).toHaveLength(0);
  });

  it('should return empty array for invalid timespan', async () => {
    const response = await supertest(app)
      .get(
        `/api/analytic/${siteID}?start=${Date.now() + 60 * 60 * 1000}&end=${
          Date.now() - 40 * 60 * 1000
        }`,
      )
      .expect(200);
    expect(response.body).toHaveProperty('data');

    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toHaveProperty('analytics');
    expect(data.analytics).toBeInstanceOf(Array);
    expect(data.analytics).toHaveLength(0);
  });
});

describe('POST /api/analytic with corrupt/invalid analytic data', () => {
  it('should return a 400 bad request error', async () => {
    delete mockMetricData.ttfb; // corrupt/invalidate data
    const mockBeacon = JSON.stringify({ ...mockMetricData, siteID });
    const response = await supertest(app)
      .post(`/api/analytic/${siteID}`)
      .send(mockBeacon)
      .set({
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      .expect(400);
    expect(response.body).toHaveProperty('error');

    const { success, error } = response.body;
    expect(success).toBe(false);
    expect(error.type).toBe('Validation');
    expect(error.message).toEqual(expect.stringContaining('required'));
  });
});
