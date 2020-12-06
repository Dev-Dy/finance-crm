// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');

// Models
var Admin = require('../models/admin');

// Library helper variables
const saltRounds = 10;

const storageProfilePic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/profile');
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});


const uploadProfilePic = multer({ storage: storageProfilePic });

/* Add Admin API */
router.post('/add', function (req, res) {
  Admin.find({ username: req.body.username }, function (err, user) {
    if (user.length > 0) {
      res.json({
        message: "Admin already exists"
      })
    }
    else {
      if (req.body.username && req.body.password) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {
          var new_user = new Admin();
          new_user.password = hashPassword;
          new_user.username = req.body.username;
          new_user.save(function (err, user) {
            if (err) {
              console.log(err)
              return
            } else {
              jwt.sign({ user }, 'secretkey', (err, token) => {
                res.json({
                  message: 'success',
                  token: token,
                  user: user
                });
              });
            }
          })
        });
      }
      else {
        res.json({
          message: 'send all the payloads',
        });
      }

    }
  });
});

/* Login Admin API */
router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    Admin.findOne({ username: req.body.username }, function (err, user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result) {
            jwt.sign({ user }, 'secretkey', (err, token) => {
              if (err) {
                res.json(err)
              }
              else {
                req.session.admin = true;
                res.json({
                  status: 'success',
                  token: token,
                  user: user
                });
              }
            });
          }
          else {
            res.json({
              message: 'failure',
            });
          }
        });
      }
      else {
        res.json({
          message: 'user does not exist',
        });
      }
    });
  }
  else {
    res.json({
      message: 'send all the payloads',
    });
  }
});

// Authorization: Bearer <access_token>

/* Verify Token function */
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }

}

module.exports = router;
