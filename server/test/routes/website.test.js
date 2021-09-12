const supertest = require('supertest');
const app = require('../../src/app');

let siteData = null;

describe('GET /website', () => {
  it('should respond with an empty array', async () => {
    const response = await supertest(app)
      .get('/website')
      .expect(200)
      .expect('Content-type', /json/);
    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toBeInstanceOf(Array);
  });
});

describe('GET /website/register', () => {
  it('should register and return the website information', async () => {
    const response = await supertest(app)
      .get('/website/register')
      .expect(200)
      .expect('Content-type', /json/);
    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('domain');
    expect(data).toHaveProperty('metricCount');
    siteData = data;
  });
});

describe('GET /website/register AGAIN', () => {
  it('should return the same website information', async () => {
    const response = await supertest(app).get('/website/register').expect('Content-type', /json/);
    const { success, data } = response.body;
    expect(success).toBe(true);
    expect(data).toBeInstanceOf(Object);
    expect(data).toStrictEqual(siteData);
  });
});

describe('DELETE /website/siteID', () => {
  it('should delete the website', async () => {
    const response = await supertest(app).delete(`/website/${siteData.id}`).expect(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toEqual({});
  });
});

describe('DELETE /website/someNonExistingValidID', () => {
  it('should give a 404 not found error', async () => {
    const response = await supertest(app).delete(`/website/${siteData.id}`).expect(404);
    expect(response.body).not.toHaveProperty('data');

    const { success, error } = response.body;
    expect(success).toBe(false);
    expect(error).toHaveProperty('type');
    expect(error.type).toBe('Validation');
    expect(error).toHaveProperty('message');
  });
});

describe('DELETE /website/someInvalidID', () => {
  it('should give a 400 bad request error', async () => {
    const response = await supertest(app).delete('/website/someInvalidID').expect(400);
    expect(response.body).not.toHaveProperty('data');

    const { success, error } = response.body;
    expect(success).toBe(false);
    expect(error).toHaveProperty('type');
    expect(error.type).toBe('Validation');
    expect(error).toHaveProperty('message');
    expect(error.message).toEqual(expect.stringContaining('invalid'));
  });
});
