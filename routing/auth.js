const express=require('express');
const app = express.Router();

const auth = require('../modules/auth/auth');

app.post('/sign-up', auth.signUp);
app.post('/sign-in', auth.signIn);



module.exports = app;