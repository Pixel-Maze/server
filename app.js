if(process.env.NODE_ENV == 'development') {
  require('dotenv').config()
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/index');
const Room = require('./models/room');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,
  {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('mongodb connected'))
  .catch(console.log)

app.use('/', routes)

var name = []


let count = 0;
let enemyPositionServer = []

io.on('connection', function (socket) {
  console.log('socket io now connect')

  socket.on('sendroom', function (data) {
    io.emit('sendroom', data)
  })

  socket.on('deleteroom', function (data) {
    io.emit('deleteroom')
  })

  socket.on('join-room', function (data) {
    // console.log('dalam ')
    // console.log(data)
    // socket.join(data.id)
    socket.broadcast.emit('join-rooms', data)
  })

  socket.on('leaving-room', function (data) {
    socket.broadcast.emit('leaving-rooms', data)
  })

  socket.on('send', function (data) {
    io.emit('send', data)
  })


  socket.on('play-game', function (data) {
    io.emit('play-game', data)
  })

  // socket.on('getId', () => {
  //   count++
  //   console.log(count)
  //   socket.emit('sendId', count)
  // })

  socket.on('newUser', function (data) {
    count ++
    data.id = count;
    enemyPositionServer.push(data)

    socket.emit('sendId', data.id)

    console.log(enemyPositionServer)
  })

  socket.on('top', function (data) {
    enemyPositionServer.forEach(function(enemy) {
      if (enemy.id === data.id) {
        enemy.top = data.top
      }
    })
    socket.emit('enemyPosition', enemyPositionServer)
    console.log(enemyPositionServer)
  })

  socket.on('toLeft', function(data) {
    enemyPositionServer.forEach(function(enemy) {
      if (enemy.id === data.id) {
        enemy.toLeft = data.toLeft
      }
    })
    socket.emit('enemyPosition', enemyPositionServer)
    console.log(enemyPositionServer)
  })

  socket.on('deg', function(data) {
    enemyPositionServer.forEach(function (enemy) {
      if (enemy.id === data.id) {
        enemy.deg = data.deg
      }
    })
    socket.emit('enemyPosition', enemyPositionServer)
  })
  
  socket.on('topPos', data => {
    // enemyPosition.forEach(function (enemy) {
      // if (enemy.id == data.id) {
      //   enemy.top = data.top
      // }
    // })

    // socket.emit('getEnemy', enemyPosition)
    // console.log('masuk ', data)
    io.emit('topPos', data)
  })

  socket.on('downPos', data => {
    // enemyPosition.forEach(function (enemy) {
    //   if (enemy.id == data.id) {
    //     enemy.toLeft = data.toLeft
    //   }
    // })

    io.emit('downPos', data)
  })

  socket.on('leftPos', data => {
    // enemyPosition.forEach(function (enemy) {
    //   if (enemy.id == data.id) {
    //     enemy.toLeft = data.toLeft
    //   }
    // })
    // socket.emit('getEnemy', enemyPosition)

    io.emit('leftPos', data)
  })


  socket.on('rightPos', data => {
    // enemyPosition.forEach(function (enemy) {
    //   if (enemy.id == data.id) {
    //     enemy.toLeft = data.toLeft
    //   }
    // })

    io.emit('rightPos', data)
  })




  // socket.on('getId', () => {
  //   count++
  //   let playerId = count;
  //   console.log(playerId)
  //   socket.emit('getId', playerId)
    
  // })

  // socket.on('newUser', (data) => {
  //   socket.broadcast.emit('newUser', data)
   
  // })
  
  // socket.on('top', (data) => {
  // console.log(data)
  // socket.broadcast.emit('top', data)
  // })

  // socket.on('toLeft', (data) => {
  //   console.log(data)
  //   socket.broadcast.emit('toLeft', data)
  // })

  // socket.on('deg', (data) => {
  //   console.log(data)
  //   socket.broadcast.emit('deg', data)
  // })

  socket.on('rotateClock', data => {
    io.emit('rotateClock', data)
  })

  socket.on('rotateRevClock', data => {
    io.emit('rotateClock', data)
  })
})

// io.of('/room').on('connection', function(socket) {
//   console.log('masuk io of '+ socket)


// })


app.use(errorHandler)

http.listen(PORT, () => console.log(`Listening on PORT ${PORT} - socket.io`))