import { Application } from "express";
import mongoose from "mongoose";
import request from "supertest";
import appPromise from "../src/app";

let app: Application;
let token: string;

beforeAll(async () => {
  app = await appPromise;
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      user: {
        email: "vardiroy4@gmail.com",
        password: "abc123",
      },
    });
  token = response.body.accessToken;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("User", () => {
  test("connected user info", async () => {
    const res = await request(app)
      .get("/api/users/myInfo")
      .set("authorization", token);
    expect(res.statusCode).toEqual(200);
  });

  test("user photo", async () => {
    const res = await request(app)
      .get("/api/users/myPhoto/vardiroy4@gmail.com")
      .set("authorization", token);
    expect(res.statusCode).toEqual(200);
  });
  
  test("connected user update status", async () => {
    const res = await request(app)
      .post("/api/users/myInfo")
      .set("authorization", token)
      .send({
        status: 'this is a test status'
      })
    expect(res.statusCode).toEqual(200);
  });
});
