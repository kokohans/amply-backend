const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = chai.expect;

chai.use(chaiHTTP);

const User = require("../../src/models/user_model");
const Post = require("../../src/models/post_model");

let server = require("../../src/app");

describe("Post Controller", () => {
  let uid = "";
  let post_id = "";

  before(async () => {
    User.deleteMany({});
    Post.deleteMany({});

    let user_data = {
      username: "kokohan_post",
      email: "hans_post@gmail.com",
      description: "this is my personal space",
    };

    let new_user = new User(user_data);
    let user = await new_user.save();
    uid = user["_id"];

    let post_data = {
      body: "this is hans's tweet",
      comments: [],
      user: uid,
      created_at: new Date().toISOString(),
    };

    let new_post = new Post(post_data);

    let post = await new_post.save();
    post_id = post["_id"];
  });

  after(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("GET /api/v1/posts", () => {
    let post_url = "/api/v1/posts";
    let response, error;

    before((done) => {
      chai
        .request(server)
        .get(post_url)
        .end((err, res) => {
          error = err;
          response = res;
          done();
        });
    });

    it("should return 200 OK", () => {
      expect(response.statusCode).to.equals(200);
    });

    it("should return response with JSON", () => {
      expect(response.body).to.have.property("message");
      expect(response.body["message"]).to.be.an.an("array");
      expect(response.body["err"]).to.be.null;
    });
  });

  describe("GET /api/v1/posts/:post_id", () => {
    let post_url = "/api/v1/posts/";
    let response, error;

    before((done) => {
      chai
        .request(server)
        .get(post_url + post_id)
        .end((err, res) => {
          error = err;
          response = res;
          done();
        });
    });

    it("should return 200 OK", () => {
      expect(response.statusCode).to.equals(200);
    });

    it("should return response with JSON", () => {
      expect(response.body).to.have.property("message");
      expect(response.body["err"]).to.be.null;
    });
  });
});
