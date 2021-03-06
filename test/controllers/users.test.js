const chai = require("chai");
const chaiHTTP = require("chai-http");
const expect = chai.expect;

const User = require("../../src/models/user_model");

chai.use(chaiHTTP);

let server = require("../../src/app");

describe("User Controller", () => {
  before((done) => {
    User.deleteMany({});

    let userData = {
      username: "kokohan",
      email: "hans@gmail.com",
      description: "this is my personal space",
    };

    let newUser = new User(userData);
    newUser.save((err) => {
      done();
    });
  });

  after((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe("GET /api/v1/users", () => {
    let response, error;
    const user_path = "/api/v1/users";

    before((done) => {
      chai
        .request(server)
        .get(user_path)
        .end((err, res) => {
          error = err;
          response = res;
          done();
        });
    });

    it("should return 200 OK", () => {
      expect(response.statusCode).to.equals(200);
    });

    it("should return all users with JSON", () => {
      expect(response.body["message"]).to.not.null;
      expect(response.body["message"]).to.have.lengthOf.above(0);
    });
  });

  describe("GET /api/v1/users/:uid", () => {
    const user_path = "/api/v1/users/";

    describe("with valid input", () => {
      let response, error;
      before((done) => {
        User.findOne({ username: "kokohan" }, (err, existing_user) => {
          chai
            .request(server)
            .get(user_path + existing_user["_id"])
            .end((err, res) => {
              error = err;
              response = res;
              done();
            });
        });
      });

      it("should return 200 OK", () => {
        expect(response.statusCode).to.equals(200);
      });

      it("should contain message on body", () => {
        expect(response.body["message"]).to.not.undefined;
        expect(response.body["err"]).to.be.null;
      });
    });

    describe("with invalid input", () => {
      let response, error;
      before((done) => {
        chai
          .request(server)
          .get(user_path + "000000000000000")
          .end((err, res) => {
            error = err;
            response = res;
            done();
          });
      });

      it("should return 404 NOT FOUND", () => {
        expect(response.statusCode).to.equals(404);
      });

      it("should return err with true", () => {
        expect(response.body["err"]).to.be.true;
      });
    });
  });

  describe("POST /api/v1/users", () => {
    let response, error;
    const user_path = "/api/v1/users";
    describe("with valid input", () => {
      it("should response with HTTP 201", (done) => {
        let userData = {
          username: "kokodeh",
          email: "hansdeh@gmail.com",
          description: "this is my personal space",
        };

        chai
          .request(server)
          .post(user_path)
          .send(userData)
          .end((err, res) => {
            expect(res.statusCode).to.equals(201);
            expect(res.body["err"]).to.be.null;
            done();
          });
      });
    });
    describe("with invalid input", () => {
      it("should response with HTTP 400 due duplicate input", (done) => {
        let userData = {
          username: "kokohan",
          email: "hans@gmail.com",
          description: "this is my personal space",
        };

        chai
          .request(server)
          .post(user_path)
          .send(userData)
          .end((err, res) => {
            expect(res.statusCode).to.equals(400);
            done();
          });
      });

      it("should response with HTTP 400 when email empty", (done) => {
        let userData = {
          username: "kokohan",
          email: null,
          description: "this is my personal space",
        };

        chai
          .request(server)
          .post(user_path)
          .send(userData)
          .end((err, res) => {
            expect(res.statusCode).to.equals(400);
            done();
          });
      });

      it("should response with HTTP 400 when username missing on body req", (done) => {
        let userData = {
          email: "hans@gmail.com",
          description: "this is my personal space",
        };

        chai
          .request(server)
          .post(user_path)
          .send(userData)
          .end((err, res) => {
            expect(res.body["message"]).to.eq("missing username");
            expect(res.statusCode).to.equals(400);
            done();
          });
      });

      it("should response with HTTP 400 when email missing on body req", (done) => {
        let userData = {
          username: "kokohan",
          description: "this is my personal space",
        };

        chai
          .request(server)
          .post(user_path)
          .send(userData)
          .end((err, res) => {
            expect(res.body["message"]).to.eq("missing email");
            expect(res.statusCode).to.equals(400);
            done();
          });
      });

      it("should response with HTTP 400 when email and username missing on body req", (done) => {
        chai
          .request(server)
          .post(user_path)
          .end((err, res) => {
            expect(res.body["message"]).to.eq("missing username & email");
            expect(res.statusCode).to.equals(400);
            done();
          });
      });
    });
  });
});
