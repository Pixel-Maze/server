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
let enemyPosition = []

io.on('connection', function (socket) {
  console.log('socket io now connect')


  socket.on('send', function (data) {
    io.emit('send', data)
  })


  socket.on('playerId', (data) => {
    count++
    data.id = count
    enemyPosition.push(data)
    console.log(enemyPosition)
    socket.emit('numberId', count)
  })

  socket.on('enemyPosition', data => {
    socket.broadcast.emit('enemyPosition', data)
  })

  socket.on('getPlayerPosition', () => {
    socket.emit('sendPlayerPosition', enemyPosition)
  })
  
  socket.on('topPos', data => {
    enemyPosition.forEach(function (enemy) {
      if (enemy.id == data.id) {
        enemy.top = data.top
      }
    })

    socket.emit('getEnemy', enemyPosition)

  })


  socket.on('leftPos', data => {
    enemyPosition.forEach(function (enemy) {
      if (enemy.id == data.id) {
        enemy.toLeft = data.toLeft
      }
    })
    socket.emit('getEnemy', enemyPosition)
  })

  socket.on('rightPos', data => {
    enemyPosition.forEach(function (enemy) {
      if (enemy.id == data.id) {
        enemy.toLeft = data.toLeft
      }
    })
  })


  socket.on('deg', data => {
    enemyPosition.forEach(function (enemy) {
      if (enemy.id == data.id) {
        enemy.deg = data.deg
      }
    })
    socket.emit('getEnemy', enemyPosition)
  })

})



http.listen(PORT, () => console.log(`Listening on PORT ${PORT} - socket.io`))