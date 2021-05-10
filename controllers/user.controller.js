const User = require("../models/user.model");
const Blog = require("../models/blog.model");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");

const { errorHandler } = require("../helpers/dbErrorHandeler");

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
  let username = req.params.username;
  let user;
  let blogs;

  User.findOne({ username }).exec((err, userFromDB) => {
    if (err || !userFromDB) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    user = userFromDB;
    let userId = user._id;

    console.log(user.role);
    Blog.find({ postedBy: userId })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .limit(10)
      .select(
        "_id title excerpt categories slug tags postedBy craetedAt updatedAt "
      )
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }

        user.photo = undefined;
        user.hashed_password = undefined;
        res.json({
          user,
          blogs: data,
        });
      });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    console.log(user);
    user = _.extend(user, fields);

    if (fields.password && fields.password.length < 6) {
      return res.status(400).json({
        error: "Password should be min 6 characters long",
      });
    }

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb",
        });
      }
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: "All filds required",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      user.photo = undefined;
      res.json(user);
    });
  });
};

exports.photo = (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
      .select('photo')
      .exec((err, user) => {
          if (err || !user) {
              return res.status(400).json({
                  error: errorHandler(err)
              });    
          }
          res.set('Content-Type', user.photo.contentType);
          return res.send(user.photo.data);
      });
};
