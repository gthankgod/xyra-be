const express = require('express');
const { submitAnswers, generatePDF } = require('../controllers/finance');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/submit', submitAnswers);
router.get('/pdf/:id', verifyToken, generatePDF);

module.exports = router;
