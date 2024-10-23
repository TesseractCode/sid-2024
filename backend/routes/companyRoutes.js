
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/search', companyController.searchCompanies);
router.get('/:cif/balances', companyController.getCompanyData);
router.get('/:cif/balances/:year', companyController.getCompanyDataByYear);



module.exports = router;
