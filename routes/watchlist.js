// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');
const axios = require('axios');

var Client = require('../models/client')
var Watchlist = require('../models/watchlist');

var X_RAPIDAPI_KEY = "3c8b4e5f69msh2862dce0fc58141p1d92b8jsn06a8eacca8e0";
var X_RAPIDAPI_HOST = "yahoo-finance-low-latency.p.rapidapi.com";
var X_RAPIDAPI_BASE_URL = "https://yahoo-finance-low-latency.p.rapidapi.com/";

/* Add API */
router.post('/add', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var user = new Watchlist();
            user.stock = req.body.stock + ".NS"
            user.client_id = req.session.client_id
            user.save(function (err, savedUser) {
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
});

router.get('/current/get', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Watchlist.find({ 'client_id': req.session.client_id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    var symbolString = ""
                    if (users.length > 0) {
                        for (var i = 0; i < users.length; i++) {
                            symbolString = symbolString + users[i].stock + ","
                        }
                        var axiosConfig = {
                            headers: {
                                'x-rapidapi-key': X_RAPIDAPI_KEY,
                                'x-rapidapi-host': X_RAPIDAPI_HOST
                            },
                            params: {
                                symbols: symbolString
                            }
                        }
                        var url = X_RAPIDAPI_BASE_URL + "v6/finance/quote";

                        axios.get(url, axiosConfig)
                            .then(function (response) {
                                res.json({
                                    data: response.data.quoteResponse.result
                                })

                            })
                            .catch(err => console.log(err))
                    }
                    else {
                        res.json({
                            data: []
                        })
                    }

                }
            });
        }
    });
});

router.get('/delete/:symbol', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            if (req.session.client_id) {
                Watchlist.deleteOne({ 'client_id': req.session.client_id, 'stock': req.params.symbol }, function (err, user) {
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
            else {
                res.json({
                    message: 'Failure',
                });
            }

        }
    });
});

/* Delete All API */
router.get('/delete', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Watchlist.deleteMany(function (err, user) {
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