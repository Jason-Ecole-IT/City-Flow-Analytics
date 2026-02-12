const request = require('supertest');
const app = require('../index');

describe('Frontend server', () => {
  test('GET /health should return ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
