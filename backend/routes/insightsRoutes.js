const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController'); // Ensure this path is correct

// Route for comparing company to sector
router.get('/compare-company-sector', insightsController.compareCompanyToSector);

// Route for finding similar companies
router.get('/find-similar-companies', insightsController.findSimilarCompanies);

// Route for company risk assessment
router.get('/company-risk-assessment', insightsController.companyRiskAssessment);

module.exports = router;
