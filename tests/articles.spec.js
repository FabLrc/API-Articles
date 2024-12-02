const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA_USER = {
    _id: USER_ID,
    name: "test",
    email: "test@test.com",
    password: "azertyuiop",
    role: "admin",
  };
  const MOCK_DATA_CREATED = {
    title: "test",
    content: "test",
    status: "published",
  };
  const ARTICLE_ID = "5e4f4f5f5f5f5f5f5f5f5f5f";

  const MOCK_DATA_UPDATED = {
    _id: ARTICLE_ID,
    title: "test2",
    content: "test2",
    status: "draft",
  };

  const MOCK_DATA_EXISTING = {
    _id: ARTICLE_ID,
    title: "test",
    content: "test",
    status: "published",
    userId: USER_ID,
  };
  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_DATA_USER, "findOne");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("CREATE Article", async () => {
    const res = await request(app)
      .post("/api/articles/create")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    console.log("Le MOCK_DATA_CREATED :", MOCK_DATA_CREATED);
    console.log("Le Body :", res.body);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
    expect(res.body.content).toBe(MOCK_DATA_CREATED.content);
  });
  test("UPDATE Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_EXISTING, "findOne");
    mockingoose(Article).toReturn(MOCK_DATA_UPDATED, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({
        title: "test2",
        content: "test2",
        status: "draft",
      })
      .set("x-access-token", token);

    console.log("Update response:", res.body);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
    expect(res.body.content).toBe(MOCK_DATA_UPDATED.content);
  });
  test("DELETE Article", async () => {
    mockingoose(Article).toReturn(MOCK_DATA_EXISTING, "findOne");
    mockingoose(Article).toReturn({ deletedCount: 1 }, "deleteOne");

    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);

    console.log("Delete response status:", res.status);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});
