const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

router.get('/compare-company-sector', comparisonController.compareCompanyToSector);
router.get('/find-similar-companies', comparisonController.findSimilarCompanies);

module.exports = router;
