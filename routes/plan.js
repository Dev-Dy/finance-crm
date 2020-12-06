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
var Plan = require('../models/plan');

// Library helper variables
const saltRounds = 10;

/* Add API */
router.post('/add', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var user = new Plan();
            user.name = req.body.name;
            user.pricing = req.body.pricing;

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
            Plan.find(function (err, users) {
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
            Plan.findOne({ '_id': req.params.id }, function (err, users) {
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
            Plan.findOne({ '_id': id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    update_user = users;
                    update_user.name = req.body.name;
                    update_user.pricing = req.body.pricing;
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
            Plan.remove({ '_id': req.params.id }, function (err, user) {
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
            Plan.remove(function (err, user) {
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