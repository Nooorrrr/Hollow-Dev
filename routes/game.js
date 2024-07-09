const express = require('express');
const router = express.Router();
const Game = require('../models/game');

// Create a new game
router.post('/', async (req, res, next) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).send(game);
  } catch (err) {
    next(err);
  }
});

// Read all games with pagination
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const games = await Game.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Game.countDocuments();
    res.send({
      games,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    next(err);
  }
});

// Read a single game by ID
router.get('/:id', async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).send('Game not found');
    res.send(game);
  } catch (err) {
    next(err);
  }
});

// Update a game by ID
router.put('/:id', async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!game) return res.status(404).send('Game not found');
    res.send(game);
  } catch (err) {
    next(err);
  }
});

// Delete a game by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).send('Game not found');
    res.send('Game deleted');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

