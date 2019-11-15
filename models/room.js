const { model, Schema } = require('mongoose');

const RoomSchema = new Schema({
  name: {
    type: String,
    minlength: [3, 'room min 3 char'],
    required: [true, 'room need name']
  },
  create: String,
  space: []
}, {timestamps: true})

RoomSchema.pre('save', function(next) {
  this.space = [];
  next();
})

const Room = model('rooms', RoomSchema);

module.exports = Room;