const {model, Schema} = require('mongoose');

const GameSchema = new Schema ({
  RoomId: {
    type: Schema.Types.ObjectId,
    ref: 'rooms'
  },
  players: []
})


const Game = model('games', GameSchema)

module.exports = Game;