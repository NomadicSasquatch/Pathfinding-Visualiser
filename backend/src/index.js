require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const patternRoutes = require('./routes/pattern.routes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Database connected')).catch(err => console.error('Connection error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user/patterns', patternRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
