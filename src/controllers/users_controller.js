const router = require("express").Router();
const User = require("../models/user_model");

const get_users = (req, res) => {
  User.find((err, user) => {
    if (err) {
      return res.json({
        message: null,
        err: true,
      });
    }
    res.json({
      message: user,
      err: null,
    });
  });
};

const insert_user = (req, res) => {
  let username;
  let email;
  let description;
  try {
    username = req.body["username"];
    email = req.body["email"];
    description = req.body["description"];

    if (
      (username == undefined || username == null) &&
      (email == undefined || email == null)
    ) {
      throw "missing username & email";
    }

    if (username == undefined || username == null) {
      throw "missing username";
    }

    if (email == undefined || email == null) {
      throw "missing email";
    }
  } catch (e) {
    return res.status(400).json({
      message: e,
      err: true,
    });
  }

  new_user = new User({
    username: username,
    email: email,
    description: description,
  });

  new_user.save((err, res_query) => {
    if (err) {
      return res.status(400).json({
        message: err,
        err: true,
      });
    } else {
      return res.status(201).json({
        message: res_query,
        err: null,
      });
    }
  });
};

const get_one_user = (req, res) => {
  let uid = req.params["uid"];

  User.findById(uid, (err, user) => {
    if (err) {
      return res.status(404).json({ message: "not found", err: true });
    } else {
      return res.status(200).json({ message: user, err: null });
    }
  });
};

router.get("/", get_users);
router.get("/:uid", get_one_user);
router.post("/", insert_user);

module.exports = router;
