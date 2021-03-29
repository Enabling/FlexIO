const express = require('express');
const app = express();

const indexRoutes = require('./api/routes/index');

app.use('/', indexRoutes);

module.exports = app;
