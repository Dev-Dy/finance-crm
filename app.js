var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var liveUrl = 'mongodb+srv://admin:moneybhaiya@cluster0.hft7w.mongodb.net/<dbname>?retryWrites=true&w=majority';
const bodyParser = require('body-parser');

const connection = mongoose.connect(liveUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})


connection.then((connection, error) => {
  if (error) console.log(error)
  console.log("Connected to Mongo DB")
})


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var clientRouter = require('./routes/client');
var advisorRouter = require('./routes/advisor');
var planRouter = require('./routes/plan');
var announcementRouter = require('./routes/announcement');
var scheduleRouter = require('./routes/schedule');
var chatRouter = require('./routes/chat');
var stockRouter = require('./routes/stock');
var watchlistRouter = require('./routes/watchlist');
var newsRouter = require('./routes/news');
var blogRouter = require('./routes/blog');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// 
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "money_bhaiya", saveUninitialized: false, resave: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/admin', adminRouter);
app.use('/api/client', clientRouter);
app.use('/api/advisor', advisorRouter);
app.use('/api/plan', planRouter);
app.use('/api/announcement', announcementRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/chat', chatRouter);
app.use('/api/stock', stockRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/news', newsRouter);
app.use('/api/blog', blogRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
