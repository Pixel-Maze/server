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
})

// io.of('/room').on('connection', function(socket) {
//   console.log('masuk io of '+ socket)


// })


app.use(errorHandler)

http.listen(PORT, () => console.log(`Listening on PORT ${PORT} - socket.io`))