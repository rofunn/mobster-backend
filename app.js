var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { uuid } = require('uuidv4');

var mobsRouter = require('./routes/mobs');
var errorRouter = require('./routes/error');

var app = express();

const addId = (req, res, next) => {
  req.id = uuid();
  next();
};

const errorHandler = (err, req, res, next) => {
  console.log("Got to error handler")
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ error: err.message });
};


app.use(cors());
app.use(logger('dev'));
app.use(addId);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mobs', mobsRouter);
app.use(errorRouter);
app.use(errorHandler);

module.exports = app;
