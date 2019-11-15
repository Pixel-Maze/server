if(process.env.NODE_ENV == 'developemnt') {
  require('dotenv').config()
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const PORT = process.env.PORT || 3000;
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('hallo')
})

let count = 0;
let enemyPositionServer = []

io.on('connection', function (socket) {
  console.log('socket io now connect')

  socket.on('send', function (data) {
    io.emit('send', data)
  })

  socket.on('getId', () => {
    count++
    console.log(count)
    socket.emit('sendId', count)
  })

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

})



http.listen(PORT, () => console.log(`Listening on PORT ${PORT} - socket.io`))