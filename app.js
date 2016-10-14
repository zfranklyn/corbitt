var SCHEDULE = false;

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var misc = require('./misc.js');
var routes = require('./routes/index'),
    send = require('./routes/send'),
    receive = require('./routes/receive'),
    complete = require('./routes/complete');

// global variable


require('./connectDB.js');

var sched = require('./scheduling.js');

console.log("App starting up");

var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routes);
app.use('/send', send);
app.use('/receive', receive);
app.use('/complete', complete);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.sendStatus(err.status || 500);
        console.log(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.sendStatus(err.status || 500);
    console.log(err);
});

var db = require('./db.js');
var study = require('./study.js');

module.exports = app;


