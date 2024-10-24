const express = require('express');
const router = express.Router();
const externalSearchController = require('../controllers/externalSearchController');

router.get('/search', externalSearchController.searchCompaniesFromListafirme);

module.exports = router;
