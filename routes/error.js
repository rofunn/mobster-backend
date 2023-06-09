const { info } = require('console');
var express = require('express');
var error = express.Router();
const { join } = require('path');

error.get('*', (req, res, next) => {
  logger.info('User tried to go to invalid resource.')
  res.status(404).sendFile(join(__dirname, '../public/404.html'));
});

module.exports = error;
