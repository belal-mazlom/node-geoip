var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rekuire = require('rekuire');
var configs = rekuire('appConfig.js');
var logger = configs.logger;
var dbConfig = configs.dbConfig;

var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.uri, { useMongoClient: true });//, dbConfig.options);

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});

var appConfigOptions = rekuire('appConfig.js').options;


// This makes a few variables available to all Jade views.
app.use(function(req, res, next) {
  // Note that emptying the password also affects "req.user" itself
  // (vars are passed by reference)
  // Make sure this doesn't break things.
  res.locals.appConfigOptions = appConfigOptions;

  next();
});


var routes = require('./routes/routes')(mongo, mongoose);


logger.info('App started', {type: 'system'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('common', {'stream': logger.stream}));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
