const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const gameRouter = require('./routes/game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tictactoe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON request bodies
app.use(express.json());

// Serve the index.html file at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the game router for the /api/games endpoint
app.use('/api/games', gameRouter);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Internal server error' });
});

// WebSocket handling
let Array = [];
let playingArray = [];

io.on('connection', (socket) => {
  console.log("A client connected");

  socket.on("find", (e) => {
    console.log("Received find event:", e);
    if (e.namee != null) {
      Array.push(e.namee);
      console.log("Current player array:", Array);
      if (Array.length >= 2) {
        let p1obj = {
          p1name: Array[0],
          p1value: "X",
          p1move: ""
        };
        let p2obj = {
          p2name: Array[1],
          p2value: "O",
          p2move: ""
        };
        let obj = {
          p1: p1obj,
          p2: p2obj,
          sum: 1
        };
        playingArray.push(obj);
        Array.splice(0, 2);
        console.log("Updated playingArray:", playingArray);
        io.emit("find", { allPlayers: playingArray });
      }
    }
  });

  socket.on("playing", (e) => {
    let objToChange;
    if (e.value === "X") {
      objToChange = playingArray.find(obj => obj.p1.p1name === e.name);
      if (objToChange) objToChange.p1.p1move = e.id;
    } else if (e.value === "O") {
      objToChange = playingArray.find(obj => obj.p2.p2name === e.name);
      if (objToChange) objToChange.p2.p2move = e.id;
    }
    if (objToChange) objToChange.sum++;

    io.emit("playing", { allPlayers: playingArray });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




