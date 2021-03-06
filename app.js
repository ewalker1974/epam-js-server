var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://e-walker-epam-ajax-test-5251324/epam-ajax',{useMongoClient: true}); 


var index = require('./routes/index');
var users = require('./routes/users');
var table = require('./routes/table');
var tests = require('./routes/tests');
var functions = require('./routes/functions');
var spreadsheets = require('./routes/spreadsheets');
var sketch = require('./routes/sketches');

mongoose.Promise = global.Promise;

var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, PATCH, DELETE");
    return next();
  });


app.use('/', index);
app.use('/users', users);


app.use('/api/tables',table);
app.use('/api/tests',tests);
app.use('/api/functions',functions);
app.use('/api/spreadsheets',spreadsheets);
app.use('/api/sketches',sketch);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let path = req.url;
  
  
  if (path.startsWith('/api')) {
    res.status(err.status);
    res.json({error:err.message});
    return;
  }

  // render the error page
  res.status(err.status || 500);
  
  
  
  res.render('error');
});




module.exports = app;
