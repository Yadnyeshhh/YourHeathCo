process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const request = require('supertest');
const jwt = require('../server/node_modules/jsonwebtoken');
const User = require('../server/models/userModel');
const app = require('../server/server');

jest.mock('../server/models/userModel', () => ({
  findById: jest.fn().mockReturnValue({
    select: jest.fn().mockImplementation(() => Promise.resolve({ _id: '60d5f9c2e1d3c8b4f4a7c123', email: 'test@example.com' }))
  })
}));

describe('Appointment API', () => {
  const secret = process.env.JWT_SECRET || 'testsecret';
  const patientId1 = '60d5f9c2e1d3c8b4f4a7c123';
  const patientId2 = '60d5f9c2e1d3c8b4f4a7c999';

  const patientToken1 = jwt.sign({ id: patientId1, role: 'patient' }, secret);
  const patientToken2 = jwt.sign({ id: patientId2, role: 'patient' }, secret);

  test('GET /api/appointments/:patientId should require authentication', async () => {
    const res = await request(app).get(`/api/appointments/${patientId1}`);
    expect(res.status).toBe(401);
  });

  test('PUT /api/appointments/:patientId should require authentication', async () => {
    const res = await request(app)
      .put(`/api/appointments/${patientId1}`)
      .send({ date: '2023-12-01', time: '14:00' });
    expect(res.status).toBe(401);
  });

  test('GET /api/appointments/:patientId should deny access if patient does not match owner', async () => {
    const res = await request(app)
      .get(`/api/appointments/${patientId1}`)
      .set('Authorization', `Bearer ${patientToken2}`);
    expect(res.status).toBe(403);
  });

  test('PUT /api/appointments/:patientId should validate body when authorized', async () => {
    const res = await request(app)
      .put(`/api/appointments/${patientId1}`)
      .set('Authorization', `Bearer ${patientToken1}`)
      .send({ time: '14:00' }); // Missing required 'date' field
    expect(res.status).toBe(400);
  });
});
