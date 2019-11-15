const Route = require('express').Router();
const { 
  createRoom, 
  getRoomId, 
  getAllRoom, 
  joinRoom, 
  outRoom, 
  deleteRoom 
} = require('../controllers/room');

Route.get('/', getAllRoom);

Route.post('/', createRoom);

Route.get('/:id', getRoomId);

Route.patch('/join/:id', joinRoom)

Route.patch('/out/:id', outRoom)

Route.delete('/:id', deleteRoom)

module.exports = Route;