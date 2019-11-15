const Room = require('../models/room');

module.exports = {
  createRoom (req, res, next) {
    const { name, create } = req.body;
    Room.create({ name, create })
      .then(room => {
        res.status(201).json({ room })
      })
      .catch(next)
  },

  getRoomId (req, res, next) {
    Room.findById(req.params.id)
      .then(room => {
        res.status(200).json({room})
      })
      .catch(next)
  },

  getAllRoom (req, res, next) {
    Room.find().sort([['createdAt', 'descending']])
      .then(rooms => {
        res.status(200).json({ rooms })
      })
      .catch(next)
  },

  joinRoom (req, res, next) {
    const name = req.body.name
    const payload = {
      name,
      top: 0,
      toLeft: 0
    }
    let pass
    Room.findById(req.params.id)
      .then(room => {
        pass = true;
        room.space.forEach((el, i) => {
          if(el == name) pass = false;
        })
        if(!pass) {
          return room
        } else {
          return Room.findByIdAndUpdate(req.params.id, {$push: {space: payload}}, {new: true})
        }
      })
      .then((room) => {
        res.status(200).json({room, msg: `${name} join room`})
      })
      .catch(next)
  },

  outRoom (req, res, next) {
    const name = req.body.name;
    let pass = false
    Room.findById(req.params.id)
      .then(room => {
        room.space.forEach((el, i) => {
          if(el == name) pass = true;
        })
        if(pass) {
          return Room.findByIdAndUpdate(req.params.id, {$pull: {space: name}}, {new: true})
        } else {
          return
        }
      })
      .then((room) => {
        res.status(200).json({room, msg: `${name} out the Room`})
      })
      .catch(next)
  },

  deleteRoom (req, res, next) {
    Room.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(200).json({msg: 'success'})
      })
      .catch(next)
  }
}