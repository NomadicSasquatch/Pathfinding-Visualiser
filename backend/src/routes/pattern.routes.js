const express = require('express');
const router = express.Router();
const patternController = require('../controllers/pattern.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/user/patterns
router.get('/', authMiddleware, patternController.getPatterns);

// POST /api/user/patterns
router.post('/', authMiddleware, patternController.savePattern);

module.exports = router;
