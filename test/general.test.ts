import { Application } from "express";
import mongoose from "mongoose";
import request from 'supertest';
import appPromise from '../src/app';

let app: Application;

beforeAll(async () => {
  app = await appPromise
});

afterAll((done) => {
  mongoose.connection.close();
  app.listen(() => {}).close()
  done();
});

describe("General", () => {
  test("checking app status", async () => {
    const res = await request(app).get("/status")
    expect(res.statusCode).toEqual(200);
  });
});
