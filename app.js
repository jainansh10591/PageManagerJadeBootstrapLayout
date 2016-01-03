var express = require('express');
var path = require('path');
var Facebook = require('facebook-node-sdk');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var multer = require('multer');
var session = require('express-session');
var engine = require('ejs-locals');
var expressBundles = require('express-bundles');

var api = require('./routes/api');

var app = express();

app.use(multer({ dest: './public/uploads/'}))


// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// bundles
app.use(expressBundles.middleware({
  env: 'production',
  src: path.join(__dirname, 'public'),
  bundles: {
    'stylesheets/combined.css': [
      'stylesheets/bootstrap.min.css',
      'stylesheets/bootstrap.min.css.map',
      'stylesheets/DateTimePicker.css',
      'stylesheets/bootstrap-responsive.min.css',
      'stylesheets/bootstrap-theme.min.css',
      'stylesheets/bootstrap-theme.min.css.map',
      'stylesheets/styles.css'
    ],
    'javascripts/bundle.js': [
      'javascripts/jquery.js',
      'javascripts/bootstrap.min.js',
      'javascripts/main.js',
      'javascripts/DateTimePicker.js',
      'javascripts/DateTimePicker-i18n.js',
      'javascripts/moment.min.js',
      'javascripts/jqBootstrapValidation.js'
    ]
  },
  hooks: {
    '.styl': function(file, data, done) {
      stylus.render(data, done);
    }
  }
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secretSanta',
    saveUninitialized: true,
    resave: true
}));

// connect Fb
app.use(Facebook.middleware({ appId: '485782364935495', secret: '2021d1bb0d505d417e88fd4f82a7f58d', fileUpload: true}));

// Connect-Flash
app.use(flash());

// Global Vars
app.locals.moment = require('moment');
// app.locals({
//     _layoutFile:'layout.ejs'
//   });
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
