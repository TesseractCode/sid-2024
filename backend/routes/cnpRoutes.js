const express = require('express');
const router = express.Router();
const cnpController = require('../controllers/cnpController');

// Unprotected CNP validation route
router.post('/validate-cnp', cnpController.validateCNP);

module.exports = router;
