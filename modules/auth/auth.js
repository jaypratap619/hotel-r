const bcrypt = require("bcrypt");

exports.signUp = function (req, res) {

    var input = req.body;

    dbConfig.getDBConnection("mongo", function(err, db) {
        async.waterfall([function(callback) {

            if(!input.email || !input.username || !input.email || input.email == "" || input.username == "" || input.password == "") {
                return callback({
                    status: 400,
                    message: fixedData.errors.badRequest,
                    error: "Invalid input"
                });
            }

            db.collection("users").findOne({
                email: input.email
            }, function(err, user) {
                if(err) {
                    callback({
                        status: 500,
                        message: fixedData.errors.internal,
                        error: err.message
                    });
                } else if(user) {
                    callback({
                        status: 400,
                        message: fixedData.errors.badRequest,
                        error: "Email already exists"
                    });
                } else {
                    callback(null);
                }
            })

        }, function(callback) {

            db.collection("users").findOne({
                username: input.username
            }, function(err, user) {
                if(err) {
                    callback({
                        status: 500,
                        message: fixedData.errors.internal,
                        error: err.message
                    });
                } else if(user) {
                    callback({
                        status: 400,
                        message: fixedData.errors.badRequest,
                        error: "Username already exists"
                    });
                } else {
                    callback(null);
                }
            })

        }, function(callback) {

            user = {};
            user.email = input.email;
            user.username = input.username;
            user.user_id = common.getRandomUniqueId("user");
            user.created_at = moment().format();

            bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                    return callback({
                        status: 500,
                        message: fixedData.errors.internal,
                        error: err.message
                    });
                } 
                bcrypt.hash(input.password, salt, function(err, hash) {
                    if(err) {
                        return callback({
                            status: 500,
                            message: fixedData.errors.internal,
                            error: err.message
                        });
                    } 
                    user.password = hash;
                    db.collection("users").insertOne(user, function(err) {
                        if(err) {
                            return callback({
                                status: 500,
                                message: fixedData.errors.internal,
                                error: err.message
                            });
                        } else {
                            callback(null)
                        }
                    })
                });
            });


        }], function(err) {
            if(err){
                req.err = err;
                errorHandler.handle(req, res);
            } else {
                res.status(200);
                res.json({
                    status: 200,           
                    message: "User signed up successfully"
                })
            }
        });
    })
}


exports.signIn = function (req, res) {

    var input = req.body;

    async.waterfall([function(callback) {

        dbConfig.getDBConnection("mongo", function(err, db) {

            db.collection("users").findOne({username: input.username}, function(err, user) {
                if(!user) {
                    callback("err");
                } else if(user.username && user.password) {
                    bcrypt.compare(input.password, user.password, function(err, authentic) {
                       if(authentic) {
                            var token = common.generateToken(user);
                            callback(null, token);
                       } else {
                        return callback({
                            status: 403,
                            message: fixedData.errors.unauthenticated,
                            error: "Invalid credentials"
                        });
                       }
                    });
                }
            })

        })

    }], function(err, token) {
        if(err){
            req.err = err;
            errorHandler.handle(req, res);
        } else {
            res.status(200);
            res.json({
                status: 200,           
                message: "Logged in successfully",
                token: token
            })
        }
    });
}

exports.authenticateJWT = function(req, res, next) {
    
    common.isValidToken(req.headers["token"], function(err, data) {
        if(err) {
            req.err = {
                status: 401,
                message: fixedData.errors.unauthenticated,
                error: "User token invalid or expired"
            }
            errorHandler.handle(req, res);
        } else {
            if(!req.session) req.session = {};

            var userSession = {
                info: {}
            };

            Object.keys(data).map(function(key) {
                userSession.info[key] = data[key];
            })

            req.session.user = userSession;

            next();
        }
    })
}