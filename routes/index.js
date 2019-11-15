const Route = require('express').Router();
const room = require('./rooms');

Route.use('/rooms', room)

module.exports = Route;