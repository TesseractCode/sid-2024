const express = require('express');
const router = express.Router();
const companySearchController = require('../controllers/companySearchController');

router.get('/fuzzy-search', companySearchController.fuzzySearchCompanies);

module.exports = router;
