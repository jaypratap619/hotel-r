const express=require('express');
const app = express.Router();

const auth = require('../modules/auth/auth');
const bookings = require('../modules/app/bookings');

app.all('*', auth.authenticateJWT);

// app.post('/booking/check', bookings.checkBookingDetails);
app.post('/booking', bookings.bookRoom);
app.get('/bookings', bookings.getAllBookings);
app.get('/booking/:id', bookings.getBookingById);
app.delete('/booking/:id', bookings.deleteBookingById);



module.exports = app;