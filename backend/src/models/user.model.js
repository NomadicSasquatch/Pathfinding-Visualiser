const { GRID_ROWS, GRID_COLS } = require('../config/config');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// try to find a better way to format code instead of compacting patterns and users together
const nodeSchema = new Schema({
  row: { type: Number },
  col: { type: Number },
  isStart: { type: Boolean, default: false },
  isEnd: { type: Boolean, default: false },
  isWall: { type: Boolean, default: false },
  isVisited: { type: Boolean, default: false},
  waveIndex: { type: Number, default: -1},
  isInFinalPath: { type: Boolean, default: false},
  gCost: { type: Number, default: Infinity},
  hCost: { type: Number, default: Infinity},
  fCost: { type: Number, default: Infinity},
  parent: { type: Object, default: null}
});

const patternSchema = new Schema({
  name: { type: String, required: true },
  grid: [[nodeSchema]],
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patterns: {
    type: [patternSchema],
    validate: {
      validator: (val) => val.length === 3,
      message: '{PATH} must have exactly 3 patterns',
    },
    default: () => defaultPatterns(),
  },
});

const generateDefaultGrid = () => {
  return Array.from({ length: GRID_ROWS }, (_, rowIndex) =>
    Array.from({ length: GRID_COLS }, (_, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      isStart: false,
      isEnd: false,
      isWall: false,
      isVisited: false,
      waveIndex: -1,
      isInFinalPath: false,
      gCost: Infinity,
      hCost: Infinity,
      fCost: Infinity,
      parent: null,
    }))
  );
}

const defaultPatterns = () => {
  return [
    { name: 'Pattern 0', grid: generateDefaultGrid() },
    { name: 'Pattern 1', grid: generateDefaultGrid() },
    { name: 'Pattern 2', grid: generateDefaultGrid() }
  ];
}

module.exports = mongoose.model('User', userSchema);
