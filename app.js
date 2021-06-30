"use strict";

var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var compression = require('compression');
var mongoose = require('mongoose');
var path = require( 'path' );
var root = path.dirname( __dirname );
var cors = require('cors');
var app = express();

/** Middleware Configuration */
app.disable('x-powered-by');
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(logger('dev'));
app.use(cookieParser('HakbahApi')); // cookieParser - Initializing/Configuration cookie: {maxAge: 8000},
app.use(compression()); //use compression middleware to compress and serve the static content.
app.use(cors());
app.use('/', express.static(path.join(__dirname, 'app')));
app.use('/app', express.static(path.join(__dirname, '/app'), {maxAge: 7 * 86400000})); // 1 day = 86400000 ms
app.use('/uploads', express.static(path.join(__dirname, '/uploads'), {maxAge: 7 * 86400000}));
app.use('/api/user', require('./api/routes/user/index'));


/** Controll All request */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  req.header('Referer', "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/** /Middleware Configuration */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.env.NODE_ENV = 'production';
process.env.TZ = 'Asia/Riyadh';
process.env.UV_THREADPOOL_SIZE = 128;
mongoose.Promise = global.Promise;
global.underscore = require("underscore");
require('./api/models/db');

app.get('/', (req, res) => {
  res.send('You Have No Permission Access This Page');
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'app/index.html'));
// });
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch unauthorised errors
app.use((err, req, res) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: '404 Catch Unauthorised Errors'});
  }
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500).json({message: '500 Error'});
});

module.exports = app;








