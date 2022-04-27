
// exports.checkBookingDetails = function (req, res) {

//     var input = req.body;

//     async.waterfall([function(callback) {

//         dbConfig.getDBConnection("mongo", function(err, db) {

//             db.collection("bookings").findOne({room_id: input.room_id}, function(err, user) {
//                 if(!user) {
//                     callback("err");
//                 } else if(user.username && user.password) {
//                     bcrypt.compare(input.password, user.password, function(err, authentic) {
//                        if(authentic) {
//                             var token = common.generateToken(user);
//                             callback(null, token);
//                        } else {
//                         return callback({
//                             status: 403,
//                             message: fixedData.errors.unauthenticated,
//                             error: "Invalid credentials"
//                         });
//                        }
//                     });
//                 }
//             })

//         })

//     }], function(err, token) {
//         if(err){
//             req.err = err;
//             errorHandler.handle(req, res);
//         } else {
//             res.status(200);
//             res.json({
//                 status: 200,           
//                 message: "Logged in successfully",
//                 token: token
//             })
//         }
//     });
// }


exports.bookRoom = function (req, res) {

    var input = req.body;

    async.waterfall([function(callback) {

        dbConfig.getDBConnection("mongo", function(err, db) {

            var booking = {
                booking_id: common.getRandomUniqueId('book'),
                name: input.name,
                number: input.number,
                user_id: req.session.user.info.user_id,
                message: input.message,
                start: moment(input.start).format(),
                end: moment(input.end).format(),
                accommodation: input.accommodation,
                email: input.email
            }

            db.collection("bookings").insertOne(booking, function(err) {
                callback(err, booking);
            })

        })

    }], function(err, booking) {
        if(err){
            req.err = err;
            errorHandler.handle(req, res);
        } else {
            res.status(200);
            res.json({
                status: 200,           
                message: "Room booked successfully",
                data: booking
            })
        }
    });
}


exports.getAllBookings = function (req, res) {

    async.waterfall([function(callback) {

        dbConfig.getDBConnection("mongo", function(err, db) {

            db.collection("bookings").find({user_id: req.session.user.info.id}).toArray(function(err, bookings) {
                callback(err, bookings);
            })

        })

    }], function(err, bookings) {
        if(err){
            req.err = err;
            errorHandler.handle(req, res);
        } else {
            res.status(200);
            res.json({
                status: 200,           
                message: "Bookings fetched successfully",
                data: bookings
            })
        }
    });
}

exports.getBookingById = function (req, res) {

    var input = req.params;

    async.waterfall([function(callback) {

        dbConfig.getDBConnection("mongo", function(err, db) {

            db.collection("bookings").findOne({booking_id: input.id}, function(err, booking) {
                callback(err, booking);
            })

        })

    }], function(err, booking) {
        if(err){
            req.err = err;
            errorHandler.handle(req, res);
        } else {
            res.status(200);
            res.json({
                status: 200,           
                message: "Booking fetched successfully",
                data: booking
            })
        }
    });
}

exports.deleteBookingById = function (req, res) {

    var input = req.params;

    async.waterfall([function(callback) {

        dbConfig.getDBConnection("mongo", function(err, db) {

            db.collection("bookings").deleteOne({booking_id: input.id}, function(err) {
                callback(err);
            })

        })

    }], function(err) {
        if(err){
            req.err = err;
            errorHandler.handle(req, res);
        } else {
            res.status(200);
            res.json({
                status: 200,           
                message: "Booking deleted successfully"
            })
        }
    });
}