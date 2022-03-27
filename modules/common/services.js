
const jwt = require("jsonwebtoken");
const { uuid } = require('uuidv4');

exports.getRandomUniqueId = function(prefix) {

    return prefix + "_" + uuid();

}

exports.generateToken = function(data) {

    data = JSON.parse(JSON.stringify(data));

    var token = jwt.sign(data, fixedData.JWT_KEY, {
        expiresIn: fixedData.JWT_EXPIRY
    })

    return token;

}


exports.isValidToken = function(token, callback) {

    jwt.verify(token, fixedData.JWT_KEY, function(err, data) {
        callback(err, data);
    })

}

exports.generateResetToken = function(data) {

    var token = jwt.sign(data, fixedData.JWT_RESET_KEY, {
        expiresIn: fixedData.JWT_RESET_EXPIRY
    })

}

exports.isValidResetToken = function(token, callback) {

    jwt.verify(token, fixedData.JWT_RESET_KEY, function(err, data) {
        callback(err, data);
    })

}