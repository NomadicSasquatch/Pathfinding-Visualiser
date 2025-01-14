const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeSchema = new Schema({
  row: { type: Number, required: true },
  col: { type: Number, required: true },
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  grid: [[nodeSchema]],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pattern', patternSchema);