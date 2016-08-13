const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

const rooms = [{ name: 'Video Games', desc: 'Get the latest on your favorite game here!' },
  { name: 'Books', desc: 'Got books?' },
  { name: 'Programming', desc: 'Programming newb or computer wizard, you are welcome here!' }];

//routes
app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/newRoom', (req, res) => {
  console.log(req.body.name);
  rooms.push({ name: req.body.name, desc: req.body.desc });
  go_through_rooms();
  res.send(req.body.name);
});

app.get('/rooms', (req, res) => {
  res.send(rooms);
});

//main socket.io stuff
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('connected');
});

function go_through_rooms() {
  rooms.forEach((roomInfo) => {
    let room = io.of(`/${roomInfo.name}`);
    room.on('connection', (socket) => {
      console.log(`connected to ${roomInfo.name} room`);

      socket.on('new message', (data) => {
        console.log(data.message);

        room.emit('message received', { username: data.username, message: data.message, color: data.color });
      });
    });
  });
};

go_through_rooms();

server.listen(8200, () => {
  console.log('Example app listening on port 8080!');
});