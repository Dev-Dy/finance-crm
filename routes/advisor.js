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
var Schedule = require('../models/schedule');
var Client = require('../models/client');

// Library helper variables
const saltRounds = 10;

/* Add API */
router.post('/add', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {
        var user = new Advisor();
        user.username = req.body.username;
        user.password = hashPassword;
        user.fullname = req.body.fullname;
        user.reg_no = req.body.reg_no;
        user.reg_company = req.body.reg_company;
        user.email = req.body.email;
        user.telephone = req.body.telephone;
        user.fax = req.body.fax;
        user.language = req.body.language;
        user.per_address = req.body.per_address;
        user.cor_address = req.body.cor_address;
        user.liscence_val = req.body.liscence_val;
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
      });
    }
  });
});

/* Get All API */
router.get('/clients', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var advisor_id = req.session.advisor_id;
      Client.find(function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          var clientArr = [];
          for (var i = 0; i < users.length; i++) {
            if (users[i].advisor_id == advisor_id) {
              clientArr.push(users[i])
            }
          }
          res.json({
            data: clientArr,
            message: 'success'
          })
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
      Advisor.find(function (err, users) {
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

/* Get API */
router.get('/get/:id', verifyToken, function (req, res) {

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.findOne({ '_id': req.params.id }, function (err, users) {
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

router.get('/current', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.findOne({ '_id': req.session.advisor_id }, function (err, users) {
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

/* Update API */
router.post('/update/:id', verifyToken, function (req, res) {
  var id = req.params.id;
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.findOne({ '_id': id }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          update_user = users;
          update_user.username = req.body.username;
          update_user.reg_no = req.body.reg_no;
          update_user.fullname = req.body.fullname;
          update_user.reg_company = req.body.reg_company;
          update_user.email = req.body.email;
          update_user.telephone = req.body.telephone;
          update_user.fax = req.body.fax;
          update_user.language = req.body.language;
          update_user.per_address = req.body.per_address;
          update_user.cor_address = req.body.cor_address;
          update_user.liscence_val = req.body.liscence_val;
          update_user.save(function (err, savedUser) {
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
    }
  });
});

/* Delete API */
router.get('/delete/:id', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.deleteOne({ '_id': req.params.id }, function (err, user) {
        if (!err) {
          res.json({
            message: 'Deleted',
          });
        }
        else {
          console.log(err);
          res.json({
            message: 'Failure',
          });
        }
      });
    }
  });
});

/* Delete All API */
router.get('/delete', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.deleteMany(function (err, user) {
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

/* Login API */
router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    Advisor.findOne({ username: req.body.username }, function (err, user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result) {
            jwt.sign({ user }, 'secretkey', (err, token) => {
              if (err) {
                res.json(err)
              }
              else {
                req.session.advisor = true;
                req.session.advisor_id = user._id;
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

router.get('/history', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Advisor.findOne({ '_id': req.session.advisor_id }, function (err, users) {
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