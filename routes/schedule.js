// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');

// Models
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
            var docs = [];
            for (var i = 0; i < req.body.meet_time.length; i++) {
                var user = new Schedule();
                user.meet_time = req.body.meet_time[i];
                user.advisor_id = req.session.advisor_id;
                docs.push(user);
            }

            Schedule.insertMany(docs, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({
                        status: 'Fail',
                    });
                } else {
                    res.json({
                        status: 'Success',
                        data: docs
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
            Schedule.find({ 'advisor_id': req.session.advisor_id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    res.json({
                        data: users,
                        message: 'success'
                    })
                }
            }).populate("client_id");
        }
    });
});

/* Get All API */
router.get('/client/get', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Schedule.find({ 'client_id': req.session.client_id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    res.json({
                        data: users,
                        message: 'success'
                    })
                }
            }).populate("client_id");;
        }
    });
});

/* Get All API */
router.get('/slots/available', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Client.findOne({ '_id': req.session.client_id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    Schedule.find({ 'advisor_id': users.advisor_id }, function (err, users) {
                        if (err) { console.log('error = ', err) }
                        else {
                            res.json({
                                data: users,
                                message: 'success'
                            })
                        }
                    }).populate("client_id");
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
            Schedule.findOne({ '_id': req.params.id }, function (err, users) {
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
            Schedule.findOne({ '_id': id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    update_user = users;
                    update_user.meet_time = req.body.meet_time;
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

/* Update API */
router.post('/client/update/:id', verifyToken, function (req, res) {
    var id = req.params.id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Schedule.findOne({ '_id': id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    update_user = users;
                    update_user.client_id = req.session.client_id;

                    update_user.save(function (err, savedUser) {
                        if (err) {
                            console.log(err)
                            res.json({
                                status: 'Fail',
                            });
                        } else {
                            Schedule.findOne({ '_id': req.body.prevId }, function (err, users) {
                                if (err) { console.log('error = ', err) }
                                else {
                                    Schedule.remove({ '_id': req.body.prevId }, function (err, user) {
                                        if (!err) {
                                            var update_user = new Schedule();
                                            update_user._id = users._id;
                                            update_user.advisor_id = users.advisor_id;
                                            update_user.meet_time = users.meet_time;
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
                                        else {
                                            console.log(err);
                                            res.json({
                                                message: 'Failure',
                                            });
                                        }
                                    });

                                }
                            });
                        }
                    })
                }
            });
        }
    });
});

/* Book API */
router.get('/client/book/:id', verifyToken, function (req, res) {
    var id = req.params.id;
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Schedule.findOne({ '_id': id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    update_user = users;
                    update_user.client_id = req.session.client_id;
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
            Schedule.remove({ '_id': req.params.id }, function (err, user) {
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
            Schedule.remove(function (err, user) {
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