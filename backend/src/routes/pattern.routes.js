const express = require('express');
const router = express.Router();
const patternController = require('../controllers/pattern.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /api/user/patterns
router.get('/', authMiddleware, patternController.getAllPatterns);
// loading 1 pattern by slot
router.get('/:slot', authMiddleware, patternController.getPatternBySlot);
// saving 1 pattern by slot
router.put('/:slot', authMiddleware, patternController.savePatternBySlot);

module.exports = router;
