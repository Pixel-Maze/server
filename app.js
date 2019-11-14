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


io.on('connection', function (socket) {
  console.log('socket io now connect')
  socket.on('send', function (data) {
    io.emit('send', data)
  })
})



http.listen(PORT, () => console.log(`Listening on PORT ${PORT} - socket.io`))