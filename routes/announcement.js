// Libraries
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const { registerHelper } = require('hbs');
const axios = require('axios');


//api details
const INSTANCE_URL = process.env.INSTANCE_URL
const PRODUCT_ID = process.env.PRODUCT_ID
const PHONE_ID = process.env.PHONE_ID
const API_TOKEN = process.env.API_TOKEN
// Models
var Announcement = require('../models/announcement');
var Client = require('../models/client');
const { response } = require('express');


var X_RAPIDAPI_KEY = "3c8b4e5f69msh2862dce0fc58141p1d92b8jsn06a8eacca8e0";
var X_RAPIDAPI_HOST = "yahoo-finance-low-latency.p.rapidapi.com";
var X_RAPIDAPI_BASE_URL = "https://yahoo-finance-low-latency.p.rapidapi.com/";

// Library helper variables
const saltRounds = 10;

/* Add API */
router.post('/add', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            var docs = [];
            for (var i = 0; i < req.body.plan_id.length; i++) {
                var user = new Announcement();
                user.plan_id = req.body.plan_id[i];
                user.advisor_id = req.session.advisor_id;
                user.stock = req.body.stock;
                user.target_1 = req.body.target_1;
                user.entryPoint = req.body.entryPoint;
                user.stopLoss = req.body.stopLoss;
                user.target_2 = req.body.target_2;
                user.status = req.body.status;
                user.message = req.body.message;
                docs.push(user);
            }

            Announcement.insertMany(docs, (err, docs) => {
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
            Announcement.find(function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    res.json({
                        data: users,
                        message: 'success'
                    })
                }
            }).populate("plan_id");
        }
    });
});

/* Get API */
router.get('/get/:id', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Announcement.findOne({ '_id': req.params.id }, function (err, users) {
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
router.get('/client', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {

            Client.findOne({ '_id': req.session.client_id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    Announcement.find({ 'plan_id': users.plan_id, 'advisor_id': users.advisor_id }, function (err, announcements) {
                        if (err) { console.log('error = ', err) }
                        else {
                            res.json({
                                data: announcements,
                                message: 'success'
                            })
                        }
                    });
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
            Announcement.findOne({ '_id': id }, function (err, users) {
                if (err) { console.log('error = ', err) }
                else {
                    update_user = users;
                    update_user.plan_id = req.body.plan_id;
                    update_user.advisor_id = req.session.advisor_id;
                    update_user.target_1 = req.body.target_1;
                    update_user.target_2 = req.body.target_2;

                    update_user.message = req.body.message;
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
            Announcement.remove({ '_id': req.params.id }, function (err, user) {
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
            Announcement.remove(function (err, user) {
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

router.post('/addPhone', verifyToken, function(req,res){

    jwt.verify(req.token, 'secret', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            var axiosConfig = {
                headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'x.maytapi-key': API_TOKEN,
                }
            }
            axios.post(``)

        }
    })
})


router.post('/sendMessage', verifyToken, function (req, res, next) {
    
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            console.log(INSTANCE_URL)
            console.log(PHONE_ID)
            console.log(PRODUCT_ID)
            console.log(API_TOKEN)
        
            var axiosConfig = {
                headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'x-maytapi-key': API_TOKEN,
                }
            };
            let data = {
                to_number: "+918827832128", // Receivers phone
                message: "Hello, hajskj", // Message
                type: "text" // Message type
              };
              
            axios.post(`${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/sendMessage`, data, axiosConfig)
            .then(response => {
                console.log(response)
                res.json({
                    message: 'Deleted',
                });

            })
            .catch(err => console.log(err))
        }
    });
});


router.get('/stock/get', verifyToken, function (req, res) {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            Announcement.find({ 'client_id': req.session.client_id }, function (err, users) {
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