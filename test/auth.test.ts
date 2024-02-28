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

describe("Authentication", () => {
  test("register", async () => {
    const res = await request(app)
      .get("/api/recipes/users")
      .set("authorization", token);
    // .send({
    //   email: "testmail@gmail.com",
    //   password: "blabla123",
    // });
    expect(res.statusCode).toEqual(200);
  });
});
