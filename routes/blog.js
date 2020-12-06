// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');

// Models
var Advisor = require('../models/advisor');
var Blog = require('../models/blog')


/* Get All blog API */
router.get('/get/:id', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.findOne({ '_id': req.params.id }, function (err, users) {
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

router.get('/get', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.find({ 'isPublish': true }, function (err, users) {
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

/* Get All blog API */
router.get('/current/get', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.find({ 'advisor_id': req.session.advisor_id }, function (err, users) {
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

/* Add API */
router.post('/add', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      var blog = new Blog();
      blog.title = req.body.title;
      blog.content = req.body.content;
      blog.isPublish = req.body.isPublish;
      blog.advisor_id = req.session.advisor_id;
      blog.save(function (err, savedUser) {
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

/* Get All blog API */
router.get('/current/get', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.find({ 'advisor_id': req.session.advisor_id }, function (err, users) {
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

// editblog
router.post('/update/:id', verifyToken, function (req, res) {
  var id = req.params.id;
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.findOne({ '_id': id }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          update_user = users;
          update_user.title = req.body.title;
          update_user.content = req.body.content;
          update_user.isPublish = req.body.isPublish;
          update_user.advisor_id = req.session.advisor_id;
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

/*publish post*/
router.post('/publish/:id', verifyToken, function (req, res) {
  var id = req.params.id;
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.findOne({ '_id': id }, function (err, users) {
        if (err) { console.log('error = ', err) }
        else {
          publish_post = blogs;
          publish_post.title = req.body.title;
          publish_post.content = req.body.content;

          publish_post.save(function (err, savedUser) {
            if (err) {
              console.log(err)
              res.json({
                status: 'Fail',
              });
            } else {
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

/* Delete API */
router.get('/delete/:id', verifyToken, function (req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.deleteOne({ '_id': req.params.id }, function (err, user) {
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
      Blog.deleteMany(function (err, user) {
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