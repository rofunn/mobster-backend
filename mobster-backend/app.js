var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { uuid } = require('uuidv4');

var mobsRouter = require('./routes/mobs');

var app = express();

const addId = (req, res, next) => {
  req.id = uuid();
  next();
};

app.use(logger('dev'));
app.use(addId);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mobs', mobsRouter);

module.exports = app;
