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
var Advisor = require('../models/advisor');
var Chat = require('../models/chat');

// Library helper variables
const saltRounds = 10;

/* Add API */
router.post('/add', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var user = new Chat();
      user.from = req.body.from;
      user.to = req.body.to;
      user.message = req.body.message;
      user.save(function (err, savedUser) {
        if (err) {
          console.log(err)
          res.json({
            status: 'Fail',
          });
        } else {
          res.json({
            status: 'Success',
            data: savedUser
          });
        }
      })
    }
  });
});

/* Get All API */
router.get('/get', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Chat.find(function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          res.json({
            data: users,
            message: 'success'
          })
        }
      });
    }
  });
});

/* Get client API */
router.get('/get/client/current', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Chat.find({ $or: [{ 'from': req.session.client_id }, { 'to': req.session.client_id }] }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          res.json({
            data: users,
            message: 'success'
          })
        }
      });
    }
  });
});

/* Get Advisor API */
router.get('/get/advisor/:id', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Chat.find({ $or: [{ 'from': req.session.advisor_id, 'to': req.params.id }, { 'from': req.params.id, 'to': req.session.advisor_id }] }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          res.json({
            data: users,
            message: 'success'
          })
        }
      });
    }
  });
});

/* Delete All Client API */
router.get('/delete', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Chat.remove(function (err, user) {
        if (!err) {
          res.json({
            message: 'Deleted All',
          });
        }
        else {
          res.json({
            message: 'Failure',
          });
        }
      });
    }
  });
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