const Fastify = require("fastify");
const request = require("supertest");
const { expect } = require("chai");
const {
  StatusError,
  createFastifyErrorHandler,
} = require("../../lib/script.cjs");

const app = Fastify();

// Подключаем обработчик ошибок **до** маршрутов
app.setErrorHandler(createFastifyErrorHandler({ logs: false }));

// Маршрут, который выбрасывает случайную ошибку
app.get("/error", async (req, reply) => {
  throw new StatusError(400, "Random Error", {
    detail: "Something went wrong",
  });
});

// Тестируем обработку ошибок с помощью supertest
describe("Fastify Error Handling", () => {
  let server;

  before((done) => {
    // Запускаем Fastify сервер перед тестами
    app.listen({ port: 0 }, (err, address) => {
      if (err) return done(err);
      server = app.server;
      done();
    });
  });

  after((done) => {
    // Останавливаем Fastify сервер после тестов
    server.close(done);
  });

  it("should handle errors thrown in routes", async () => {
    // Выполняем запрос
    const res = await request(server).get("/error");

    console.log("Fastify Response body:", res.body);

    // Проверка, что код статуса 400
    expect(res.status).to.equal(400);

    // Проверка структуры ответа
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("details");

    // Проверка значений в ответе
    expect(res.body.message).to.equal("Random Error");
    expect(res.body.status).to.equal(400);
    expect(res.body.details).to.deep.equal({ detail: "Something went wrong" });
  });
});
