const express = require('express');

let app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`)

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser')
app.use(cookieParser(':thinking_face:'));

app.logger = require('./logger');
app.use(app.logger.express);

app.db = require('./db');

app.locals = {
  logger: app.logger,
  db: app.db,
};

require('./routes')(app);

module.exports = app;
