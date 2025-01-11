const User = require('../models/user.model');

// Save a new pattern
exports.savePattern = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.patterns.length >= 5) {
      return res.status(400).json({ error: 'Pattern limit reached.' });
    }

    const { name, patternData } = req.body;
    user.patterns.push({ name, patternData });
    await user.save();

    return res.status(201).json({ patterns: user.patterns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// Get all patterns
exports.getPatterns = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    return res.json({ patterns: user.patterns });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
};
