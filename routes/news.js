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


router.get('/get/:symbol', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var axiosConfig = {
                headers: {
                    'x-rapidapi-key': X_RAPIDAPI_KEY,
                    'x-rapidapi-host': X_RAPIDAPI_HOST
                },
                params: {
                    symbols: req.params.symbol
                }
            }
            var url = X_RAPIDAPI_BASE_URL + "v2/finance/news";

            axios.get(url, axiosConfig)
                .then(function (response) {
                    res.json({
                        data: response.data.Content.result
                    })

                })
                .catch(err => console.log(err))
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