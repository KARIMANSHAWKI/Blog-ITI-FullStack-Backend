const User = require("../models/user.model");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandeler");
const Blog = require("../models/blog.model");

// ************* Data to signup **************

/*
    1- check if email is used ? error : generate username and profile
    2-create user and save it in database
*/

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        err: "Email is taken",
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
     
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
};
// ********************************************************************** //

// ******************* Sign IN ****************** //
exports.signin = (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User With That Email Does Not Exist Please, SignUp!",
      });
    }

    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        err: "Email And Password Donot match!",
      });
    }

    // generate atoken and send it to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SCRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { expiresIn: "1d" });
    const { _id, username, name, email, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

// ************************************************************** //

// ************** Sign Out ***************** //
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "SignOut Success !",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SCRET,
  algorithms: ["HS256"],
});

// ***************** Create User Profile Middleware ******************** //
exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

// ***************** Create Admin Profile Middleware ******************** //
exports.adminMiddleWare = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource . Access denied",
      });
    }

    req.profile = user;
    next();
  });
};

// &&&&&&&&&&&&&&& Make Auth UPDATE AND DELETE BLOG &&&&&&&&&&&
exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug }).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }
    next();
  });
};
