const express = require('express');
const router = express.Router();
const localCompanyController = require('../controllers/localCompanyController');

router.get('/local-search', localCompanyController.fuzzySearchCompanies);
router.get('/company/:cif/preview-indicators', localCompanyController.searchCompanyByCifPreview);
router.get('/company/:cif/extended-indicators', localCompanyController.getCompanyByCifExtended);


module.exports = router;
