const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  p1: {
    name: String,
    value: String,
    move: String,
  },
  p2: {
    name: String,
    value: String,
    move: String,
  },
  sum: Number,
}, {
  timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

