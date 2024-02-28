// import { authenticateUser } from '../api/auth'; // assuming the auth file is located in src/auth.ts
// import { User } from '../src/models'; // assuming User model is imported from src/models.ts

import mongoose from "mongoose";
import request from 'supertest';
import app from '../src/main';

beforeAll((done) => {
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Authentication", () => {
  test("GET /", async () => {
    const res = await request(app).get("/status")
    expect(res.statusCode).toEqual(200);
  });
});
