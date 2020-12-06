// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');
const axios = require('axios');
const dotenv = require('dotenv');
var data = require('../public/data/stocks.json');

router.get('/getAll', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.send(data);
        }
    });
});

router.get('/data/:SYMBOL', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var symbol = req.params.SYMBOL + '.NS';
            var axiosConfig = {
                headers: {
                    'x-rapidapi-key': '3c8b4e5f69msh2862dce0fc58141p1d92b8jsn06a8eacca8e0',
                    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
                },
                params: {
                    symbols: symbol
                }
            }
            axios.get(`https://yahoo-finance-low-latency.p.rapidapi.com/v6/finance/quote`, axiosConfig)
            .then(function (response) {
                res.json({
                    data: response.data
                })
            })
            .catch(err => console.log(err))
        }
    });
});


router.get('/news/:SYMBOL', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var symbol = req.params.SYMBOL + '.NS';
            var axiosConfig = {
                headers: {
                    'x-rapidapi-key': '3c8b4e5f69msh2862dce0fc58141p1d92b8jsn06a8eacca8e0',
                    'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com'
                },
                params: {
                    symbols: symbol
                }
            }
            axios.get(`https://yahoo-finance-low-latency.p.rapidapi.com/v2/finance/news`, axiosConfig)
            .then(function (response) {
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

/*nsetools api*/
router.get('/top-gainers', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/fnoLosers1.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/top-loosers', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            
            
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/top-loosers', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            
            
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/year-high', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/products/dynaContent/equities/equities/json/online52NewHigh.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/year-low', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/products/dynaContent/equities/equities/json/online52NewLow.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/top-value', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_analysis/most_active/allTopValue1.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/top-volume', verifyToken, function (req, res, next) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_analysis/most_active/allTopVolume1.json`)
            .then(function (response) {
                console.log(response)
                res.json({
                    data: response.data
                })
                
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/market-status', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com//emerge/homepage/smeNormalMktStatus.json`)
            .then(function (response) {
                res.json({
                    data: response.data
                })
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/live-watch', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_watch/stock_watch/liveIndexWatchData.json`)
            .then(function (response) {
                res.json({
                    data: response.data
                })
            })
            .catch(err => console.log(err))
        }
    });
});

router.get('/company-search', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            axios.get(`https://www1.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxCompanySearch.jsp?search=`)
            .then(function (response) {
                res.json({
                    data: response.data
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