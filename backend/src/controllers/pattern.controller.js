const User = require('../models/user.model');

exports.getAllPatterns = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('patterns');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ patterns: user.patterns });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching patterns', details: err.message });
  }
};

// Loads one pattern from the specified slot [0,2] using  GET /api/user/patterns/:slot
exports.getPatternBySlot = async (req, res) => {
  try {
    const slot = parseInt(req.params.slot, 10); 
    if (slot < 0 || slot > 2) {
      return res.status(400).json({ error: 'Slot must be 0, 1, or 2' });
    }

    const user = await User.findById(req.user.id).select('patterns');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pattern = user.patterns[slot];
    res.status(200).json({ pattern });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pattern', details: err.message });
  }
};

exports.savePatternBySlot = async (req, res) => {
  try {
    const slot = parseInt(req.params.slot, 10);
    if (slot < 0 || slot > 2) {
      return res.status(400).json({ error: 'Slot must be 0, 1, or 2' });
    }

    const { name, patternData } = req.body;
    if (!name || !Array.isArray(patternData)) {
      return res.status(400).json({ error: 'Invalid pattern data' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.patterns[slot] = {
      name,
      patternData,
      createdAt: new Date(),
    };

    await user.save();
    res.status(200).json({ msg: 'Pattern saved successfully', patterns: user.patterns });
  } catch (err) {
    res.status(500).json({ error: 'Error saving pattern', details: err.message });
  }
};
