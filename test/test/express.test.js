const chai = require("chai");
chai.should();

const express = require("express");
const request = require("supertest");
const {
  StatusError,
  createExpressErrorHandler,
} = require("../../lib/script.cjs"); // Путь к вашему файлу

const app = express();

app.get("/error", (req, res, next) => {
  try {
    throw new StatusError(400, "Random Error", {
      detail: "Something went wrong",
    });
  } catch (err) {
    next(err);
  }
});

app.use(createExpressErrorHandler({ logs: false }));

describe("Express Error Handling", () => {
  it("should handle errors thrown in routes", (done) => {
    request(app)
      .get("/error")
      .end((err, res) => {
        console.log("Express Response body:", res.body);
        if (err) return done(err);
        if (res.status === 200) {
          res.text.should.equal("No error");
        } else {
          res.body.should.have.property("message", "Random Error");
          res.body.should.have.property("status", 400);
          res.body.should.have.property("details");
        }
        done();
      });
  });
});
