// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Models
var Client = require('../models/client');
var Admin = require('../models/admin');
// Library helper variables
const saltRounds = 10;


/* Add Client API */
router.post('/add', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hashPassword) {
        var user = new Client();
        user.username = req.body.username;
        user.fullname = req.body.fullname;
        user.password = hashPassword;
        user.advisor_id = '5fbf8824d921b0117873ae24';
        user.plan_id = '5fbf7c33a6340d341c91da91'
      
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


/* Get All Client API */
router.get('/get', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.find(function (err, users) {
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

/* Get Client API */
router.get('/get/:id', verifyToken, function (req, res) {

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.findOne({ '_id': req.params.id }, function (err, users) {
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

/* Get Client API */
router.get('/active', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.findOne({ '_id': req.session.id }, function (err, users) {
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

/*login*/
router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    Client.findOne({ username: req.body.username }, function (err, user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
          if (result) {
            jwt.sign({ user }, 'secretkey', (err, token) => {
              if (err) {
                res.json(err)
              }
              else {
                req.session.client = true;
                req.session.client_id = user._id;
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


/* Update User API */

router.post('/update/:id', verifyToken, function (req, res) {
  var id = req.params.id;
  console.log(id)
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.findOne({ '_id': id }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          console.log(req.body)
          update_user = users;
          update_user.username = req.body.username;
          update_user.fullname = req.body.fullname;
          update_user.email = req.body.email;
          update_user.phone = req.body.phone;

          update_user.save(function (err, savedUser) {
            if (err) {
              console.log(err)
              res.json({
                status: 'Fail',
              });
            } else {
              console.log(savedUser)
              res.json({
                status: 'success',
                data: savedUser
              });
            }
          })
        }
      });
    }
  });
});

/* Delete Client API */
router.get('/delete/:id', verifyToken, function (req, res) {
  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.remove({'_id': req.params.id }, function (err, user) {
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

/* Delete All Client API */
router.get('/delete', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.deleteMany(function (err, user) {
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

/* Get All advisors api */
router.get('/advisors', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var client_id = req.session.client_id;
      Client.find(function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          var advisorArr = [];
          for (var i = 0; i < users.length; i++) {
            if (users[i].client_id == client_id) {
              advisorArr.push(users[i])
            }
          }
          res.json({
            data: advisorArr,
            message: 'success'
          })
        }
      })
    }
  });
});

/*current*/
router.get('/current', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.findOne({ '_id': req.session.client_id }, function (err, users) {
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

// router.post('/selectadvisor/:id', verifyToken, function (req, res) {
//   var id = req.params.id;
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       Client.findOne({ '_id': id }, function (err, users) {
//         if (err) { console.log('error = ', err) }
//         else {
//           select = users;
//           select.advisor = req.body.advisor;
//           select.save(function (err, savedUser) {
//             if (err) {
//               console.log(err)
//               res.json({
//                 status: 'Fail',
//               });
//             } else {
//               console.log(savedUser)
//               res.json({
//                 status: 'success',
//                 data: savedUser
//               });
//             }
//           })
//         }
//       });
//     }
//   });
// });

router.get('/history', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Client.findOne({ '_id': req.session.client_id }, function (err, users) {
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
