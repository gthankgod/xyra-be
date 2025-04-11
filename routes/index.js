const express = require('express');
const router = express.Router();
const indexController = require('../controllers');
// const { generateReport } = require('../controllers/');
// const { verifyToken } = require('../middleware/auth');

router.get('/', (req, res) => {
    return res.status(200).json({ status: 'success', message: 'Report generation endpoint' });
});

router.get('/users', indexController.searchUserByEmail);

module.exports = router;
