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

  // correct password
  test("login success", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        user: {
          email: "vardiroy4@gmail.com",
          password: "abc123",
        },
      });
    expect(res.statusCode).toEqual(200);
  });

  // incorrect password
  test("login incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        user: {
          email: "vardiroy4@gmail.com",
          password: "wrongPassword",
        },
      });
    expect(res.statusCode).toEqual(400);
  });

  // test("register", async () => {
  //   const res = await request(app)
  //     .post("/api/auth/register")
  //     .send({
  //       user: {
  //         email: "reut.test@gmail.com",
  //         password: "myPass",
  //       },
  //     });
  //   expect(res.statusCode).toEqual(200);
  // });

  test("login", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("authorization", token);
    expect(res.statusCode).toEqual(200);
  });
});
