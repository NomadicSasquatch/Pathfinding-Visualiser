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

    // Now fetch from DB
    const { userId } = req.user;
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pattern = userDoc.patterns[slot];
    if (!pattern) {
      return res.status(404).json({ error: `No pattern at slot ${slot}` });
    }
    res.json({ pattern });
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

    const { name, grid } = req.body;
    console.log(`debugger`, name);
    if (!name || !Array.isArray(grid)) {
      return res.status(400).json({ error: 'Invalid pattern data' });
    }

    const { userId } = req.user; 
    if (!userId) {
      return res.status(400).json({ error: 'No user ID in token payload' });
    }

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    userDoc.patterns[slot] = {
      name,
      grid,
      createdAt: new Date(),
    };

    await userDoc.save();

    res.status(200).json({ 
      msg: `Pattern saved to slot ${slot} successfully`, 
      patterns: userDoc.patterns 
    });
  } catch (err) {
    console.error('Error saving pattern:', err);
    res.status(500).json({ error: 'Error saving pattern', details: err.message });
  }
};