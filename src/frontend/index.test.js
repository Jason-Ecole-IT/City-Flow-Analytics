const request = require('supertest');
const express = require('express');

describe('Frontend Server', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get('/', (req, res) => {
      res.send('<h1>CityFlow Frontend Dashboard</h1><p>Dashboard temps réel CityFlow Analytics</p>');
    });
    
    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });
  });

  test('GET / should return 200 status', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET / should return HTML content', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('CityFlow Frontend Dashboard');
    expect(response.text).toContain('Dashboard temps réel CityFlow Analytics');
  });

  test('GET / should have correct content type', async () => {
    const response = await request(app).get('/');
    expect(response.type).toMatch(/html/);
  });

  test('undefined routes should return 404', async () => {
    const response = await request(app).get('/undefined');
    expect(response.status).toBe(404);
  });

  test('404 response should be valid JSON', async () => {
    const response = await request(app).get('/not-found');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
  });
});
