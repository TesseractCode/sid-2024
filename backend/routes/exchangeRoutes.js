
const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);


router.get('/exchange', exchangeController.getExchangeRate);

module.exports = router;
